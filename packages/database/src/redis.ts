import Redis from 'ioredis';

export function createRedisClient(redisUrl?: string): Redis {
  const url = redisUrl || process.env.REDIS_URL || 'redis://:codeverse_secret@localhost:6379';
  const client = new Redis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
  });

  client.on('error', (err) => {
    console.warn('Redis Connection Warning:', err.message);
  });

  return client;
}
