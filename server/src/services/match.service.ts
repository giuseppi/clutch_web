import { prisma } from '../config/database.js';
import { NotFoundError } from '../middleware/errors.js';
import type { Prisma, MatchResult } from '@prisma/client';

export const matchService = {
  async list(params: {
    teamId?: string;
    season?: string;
    page?: number;
    limit?: number;
  }) {
    const { teamId, season, page = 1, limit = 20 } = params;
    const where: Prisma.MatchWhereInput = {};

    if (teamId) {
      where.OR = [{ homeTeamId: teamId }, { awayTeamId: teamId }];
    }
    if (season) where.season = season;

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        include: {
          homeTeam: { select: { id: true, name: true, abbreviation: true } },
          awayTeam: { select: { id: true, name: true, abbreviation: true } },
          videoJobs: { select: { id: true, status: true, type: true }, take: 1, orderBy: { createdAt: 'desc' } },
        },
        orderBy: { scheduledDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.match.count({ where }),
    ]);

    return {
      data: matches,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id: string) {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: { select: { id: true, name: true, abbreviation: true, logoUrl: true } },
        awayTeam: { select: { id: true, name: true, abbreviation: true, logoUrl: true } },
        matchStats: {
          include: { player: { select: { id: true, firstName: true, lastName: true, position: true, jerseyNumber: true, teamId: true } } },
          orderBy: { points: 'desc' },
        },
        videoJobs: { select: { id: true, status: true, completedAt: true }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!match) throw new NotFoundError('Match', id);
    return match;
  },

  async create(data: {
    scheduledDate: string;
    venue?: string;
    homeTeamId: string;
    awayTeamId: string;
    season: string;
    matchCode: string;
  }) {
    return prisma.match.create({
      data: {
        scheduledDate: new Date(data.scheduledDate),
        venue: data.venue,
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,
        season: data.season,
        matchCode: data.matchCode,
      },
    });
  },

  async update(id: string, data: {
    homeScore?: number;
    awayScore?: number;
    result?: MatchResult;
  }) {
    return prisma.match.update({ where: { id }, data });
  },

  // Get unprocessed matches for a team (for upload dropdown)
  async getScheduled(teamId: string) {
    return prisma.match.findMany({
      where: {
        isProcessed: false,
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      include: {
        homeTeam: { select: { id: true, name: true, abbreviation: true } },
        awayTeam: { select: { id: true, name: true, abbreviation: true } },
      },
      orderBy: { scheduledDate: 'desc' },
    });
  },
};
