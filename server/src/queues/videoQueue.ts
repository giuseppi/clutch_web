import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { redis } from '../config/redis.js';

export const VIDEO_QUEUE_NAME = 'video-processing';

export const videoQueue = new Queue(VIDEO_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
});

export interface VideoJobData {
  jobId: string;
  type: 'MATCH' | 'SESSION';
  matchId?: string;
  sessionId?: string;
  s3Key: string;
  homeJerseyColor?: string;
  awayJerseyColor?: string;
}

export async function enqueueVideoJob(data: VideoJobData): Promise<void> {
  // Add to BullMQ for monitoring
  await videoQueue.add('process-video', data, {
    jobId: data.jobId,
    priority: data.type === 'MATCH' ? 1 : 2,
  });

  // Also push to simple Redis list for Python worker consumption
  await redis.rpush('clutch:video:pending', JSON.stringify(data));
}
