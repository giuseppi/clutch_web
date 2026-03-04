import { prisma } from '../config/database.js';
import { redis } from '../config/redis.js';
import { NotFoundError } from '../middleware/errors.js';
import type { JobStatus } from '@prisma/client';

export const jobService = {
  async getStatus(jobId: string) {
    const job = await prisma.videoJob.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        type: true,
        status: true,
        progress: true,
        errorMessage: true,
        matchId: true,
        sessionId: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
      },
    });

    if (!job) throw new NotFoundError('VideoJob', jobId);

    // Get real-time progress from Redis if still processing
    if (job.status === 'PROCESSING' || job.status === 'QUEUED') {
      const redisProgress = await redis.hget(`job:${jobId}`, 'progress');
      if (redisProgress) {
        return { ...job, progress: parseInt(redisProgress, 10) };
      }
    }

    return job;
  },

  async listByMatch(matchId: string) {
    return prisma.videoJob.findMany({
      where: { matchId },
      select: {
        id: true,
        type: true,
        status: true,
        progress: true,
        errorMessage: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async listBySession(sessionId: string) {
    return prisma.videoJob.findMany({
      where: { sessionId },
      select: {
        id: true,
        type: true,
        status: true,
        progress: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Called by Python worker via internal API
  async updateStatus(jobId: string, data: {
    status: JobStatus;
    errorMessage?: string;
    progress?: number;
  }) {
    const updateData: Record<string, unknown> = { status: data.status };
    if (data.errorMessage) updateData.errorMessage = data.errorMessage;
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.status === 'PROCESSING') updateData.startedAt = new Date();
    if (data.status === 'COMPLETED') {
      updateData.completedAt = new Date();
      updateData.progress = 100;
    }

    return prisma.videoJob.update({
      where: { id: jobId },
      data: updateData,
    });
  },
};
