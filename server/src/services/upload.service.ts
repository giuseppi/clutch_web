import { v4 as uuid } from 'uuid';
import { prisma } from '../config/database.js';
import { generatePresignedUploadUrl } from '../config/s3.js';
import { enqueueVideoJob } from '../queues/videoQueue.js';
import { ValidationError, NotFoundError, ForbiddenError } from '../middleware/errors.js';
import type { JobType } from '@prisma/client';

export const uploadService = {
  async generatePresignedUrl(data: {
    matchId?: string;
    sessionId?: string;
    fileName: string;
    contentType: string;
    type: JobType;
    userId: string;
    teamId: string;
  }) {
    if (data.contentType !== 'video/mp4') {
      throw new ValidationError('Only MP4 files are supported');
    }

    // Validate that match/session exists and belongs to user's team
    if (data.type === 'MATCH') {
      if (!data.matchId) throw new ValidationError('matchId required for match uploads');
      const match = await prisma.match.findUnique({ where: { id: data.matchId } });
      if (!match) throw new NotFoundError('Match', data.matchId);
      if (match.homeTeamId !== data.teamId && match.awayTeamId !== data.teamId) {
        throw new ForbiddenError('Match does not belong to your team');
      }
    } else {
      if (!data.sessionId) throw new ValidationError('sessionId required for session uploads');
      const session = await prisma.session.findUnique({ where: { id: data.sessionId } });
      if (!session) throw new NotFoundError('Session', data.sessionId);
      if (session.teamId !== data.teamId) {
        throw new ForbiddenError('Session does not belong to your team');
      }
    }

    const fileId = uuid();
    const folder = data.type === 'MATCH' ? `matches/${data.matchId}` : `sessions/${data.sessionId}`;
    const s3Key = `uploads/${folder}/${fileId}.mp4`;
    const bucket = process.env.S3_BUCKET!;

    const uploadUrl = await generatePresignedUploadUrl(bucket, s3Key, data.contentType);

    return { uploadUrl, s3Key };
  },

  async confirmUpload(data: {
    matchId?: string;
    sessionId?: string;
    s3Key: string;
    homeJerseyColor?: string;
    awayJerseyColor?: string;
    type: JobType;
    userId: string;
  }) {
    // Create VideoJob record
    const job = await prisma.videoJob.create({
      data: {
        type: data.type,
        matchId: data.matchId,
        sessionId: data.sessionId,
        uploadedById: data.userId,
        rawVideoS3Key: data.s3Key,
        homeJerseyColor: data.homeJerseyColor,
        awayJerseyColor: data.awayJerseyColor,
        status: 'QUEUED',
      },
    });

    // Enqueue for processing
    await enqueueVideoJob({
      jobId: job.id,
      type: data.type,
      matchId: data.matchId,
      sessionId: data.sessionId,
      s3Key: data.s3Key,
      homeJerseyColor: data.homeJerseyColor,
      awayJerseyColor: data.awayJerseyColor,
    });

    return job;
  },
};
