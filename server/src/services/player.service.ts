import { prisma } from '../config/database.js';
import { NotFoundError } from '../middleware/errors.js';
import type { Prisma } from '@prisma/client';

export const playerService = {
  async list(params: {
    teamId?: string;
    position?: string;
    gradYear?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { teamId, position, gradYear, search, page = 1, limit = 20 } = params;
    const where: Prisma.PlayerWhereInput = {};

    if (teamId) where.teamId = teamId;
    if (position) where.position = position;
    if (gradYear) where.graduationYear = gradYear;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        include: {
          team: { select: { id: true, name: true, abbreviation: true, state: true, classification: true, level: true } },
        },
        orderBy: { mmr: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.player.count({ where }),
    ]);

    return {
      data: players,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        team: { select: { id: true, name: true, abbreviation: true, state: true, classification: true, level: true } },
        matchStats: {
          include: { match: { select: { id: true, matchCode: true, scheduledDate: true, homeScore: true, awayScore: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        eloHistory: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        highlightClips: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!player) throw new NotFoundError('Player', id);

    // Compute career averages
    const stats = player.matchStats;
    const gamesPlayed = stats.length;
    const careerAvg = gamesPlayed > 0 ? {
      ppg: +(stats.reduce((s, m) => s + m.points, 0) / gamesPlayed).toFixed(1),
      rpg: +(stats.reduce((s, m) => s + m.offRebounds + m.defRebounds, 0) / gamesPlayed).toFixed(1),
      apg: +(stats.reduce((s, m) => s + m.assists, 0) / gamesPlayed).toFixed(1),
      spg: +(stats.reduce((s, m) => s + m.steals, 0) / gamesPlayed).toFixed(1),
      bpg: +(stats.reduce((s, m) => s + m.blocks, 0) / gamesPlayed).toFixed(1),
      fgPct: +(stats.reduce((s, m) => s + m.fgMade, 0) / Math.max(stats.reduce((s, m) => s + m.fgAttempted, 0), 1) * 100).toFixed(1),
      fg3Pct: +(stats.reduce((s, m) => s + m.fg3Made, 0) / Math.max(stats.reduce((s, m) => s + m.fg3Attempted, 0), 1) * 100).toFixed(1),
      ftPct: +(stats.reduce((s, m) => s + m.ftMade, 0) / Math.max(stats.reduce((s, m) => s + m.ftAttempted, 0), 1) * 100).toFixed(1),
      mpg: +(stats.reduce((s, m) => s + m.minutes, 0) / gamesPlayed).toFixed(1),
    } : null;

    return { ...player, careerAvg, gamesPlayed };
  },

  async create(data: {
    firstName: string;
    lastName: string;
    position: string;
    jerseyNumber?: string;
    heightInches?: number;
    weightLbs?: number;
    graduationYear: number;
    teamId: string;
  }) {
    return prisma.player.create({ data });
  },

  async update(id: string, data: Partial<{
    firstName: string;
    lastName: string;
    position: string;
    jerseyNumber: string;
    heightInches: number;
    weightLbs: number;
    photoUrl: string;
    isVerified: boolean;
  }>) {
    return prisma.player.update({ where: { id }, data });
  },

  async getEloHistory(playerId: string) {
    return prisma.eloHistory.findMany({
      where: { playerId },
      orderBy: { createdAt: 'asc' },
    });
  },

  async getStats(playerId: string) {
    return prisma.matchStat.findMany({
      where: { playerId },
      include: {
        match: {
          select: { id: true, matchCode: true, scheduledDate: true, homeScore: true, awayScore: true, homeTeamId: true, awayTeamId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
