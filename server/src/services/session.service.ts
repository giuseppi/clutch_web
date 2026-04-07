import { prisma } from '../config/database.js';
import { NotFoundError } from '../middleware/errors.js';
import type { SessionType, Prisma } from '@prisma/client';

export const sessionService = {
  async list(params: {
    teamId: string;
    type?: SessionType;
    page?: number;
    limit?: number;
  }) {
    const { teamId, type, page = 1, limit = 20 } = params;
    const where: Prisma.SessionWhereInput = { teamId };
    if (type) where.sessionType = type;

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        include: {
          videoJobs: { select: { id: true, status: true }, take: 1, orderBy: { createdAt: 'desc' } },
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.session.count({ where }),
    ]);

    return {
      data: sessions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id: string) {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        sessionStats: {
          include: { player: { select: { id: true, firstName: true, lastName: true, position: true, jerseyNumber: true } } },
        },
        videoJobs: { select: { id: true, status: true, completedAt: true }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!session) throw new NotFoundError('Session', id);
    return session;
  },

  async create(data: {
    title: string;
    sessionType: SessionType;
    date: string;
    notes?: string;
    teamId: string;
  }) {
    return prisma.session.create({
      data: {
        title: data.title,
        sessionType: data.sessionType,
        date: new Date(data.date),
        notes: data.notes,
        teamId: data.teamId,
      },
    });
  },
};
