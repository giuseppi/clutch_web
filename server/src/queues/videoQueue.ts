import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { redis } from '../config/redis.js';

export const VIDEO_QUEUE_NAME = 'video-processing';

/** Lazy-init so importing routes doesn't block HTTP server startup on BullMQ/Redis. */
let _videoQueue: Queue | null = null;
function getVideoQueue(): Queue {
  if (!_videoQueue) {
    _videoQueue = new Queue(VIDEO_QUEUE_NAME, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 500 },
      },
    });
  }
  return _videoQueue;
}

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
  await getVideoQueue().add('process-video', data, {
    jobId: data.jobId,
    priority: data.type === 'MATCH' ? 1 : 2,
  });

  // Also push to simple Redis list for Python worker consumption
  await redis.rpush('clutch:video:pending', JSON.stringify(data));
}
