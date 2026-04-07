import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Direct ioredis client — handles redis:// and rediss:// (TLS) URLs natively
// lazyConnect: don't block process startup on TCP handshake (Docker/Redis can be slow).
export const redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

// BullMQ requires a separate connection config object (not a shared instance).
// Parse TLS and auth from the URL so Upstash (rediss://) works in production.
const url = new URL(redisUrl);
export const redisConnection = {
  host: url.hostname,
  port: parseInt(url.port || '6379'),
  password: url.password || undefined,
  tls: url.protocol === 'rediss:' ? {} : undefined,
};
