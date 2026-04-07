import { prisma } from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const leaderboardService = {
  async getLeaderboard(params: {
    state?: string;
    classification?: string;
    gradYear?: number;
    position?: string;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const { state, classification, gradYear, position, search, sortBy = 'mmr', page = 1, limit = 25 } = params;

    const where: Prisma.PlayerWhereInput = {};

    if (position) where.position = position;
    if (gradYear) where.graduationYear = gradYear;

    // Team-level filters
    const teamWhere: Prisma.TeamWhereInput = {};
    if (state) teamWhere.state = state;
    if (classification) teamWhere.classification = classification;
    if (Object.keys(teamWhere).length > 0) {
      where.team = teamWhere;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { team: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Determine sort order
    const orderBy: Prisma.PlayerOrderByWithRelationInput =
      sortBy === 'name' ? { lastName: 'asc' } :
      sortBy === 'gradYear' ? { graduationYear: 'asc' } :
      { mmr: 'desc' };

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        include: {
          team: {
            select: { id: true, name: true, abbreviation: true, state: true, classification: true, level: true, logoUrl: true },
          },
          eloHistory: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { delta: true, createdAt: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.player.count({ where }),
    ]);

    // Attach rank and trend
    const startRank = (page - 1) * limit + 1;
    const ranked = players.map((player, idx) => ({
      rank: startRank + idx,
      ...player,
      trend: player.eloHistory[0]?.delta ?? 0,
    }));

    return {
      data: ranked,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};
