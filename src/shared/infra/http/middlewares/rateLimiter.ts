import Redis from 'ioredis';
import cacheConfig from '@config/cache';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/errors/AppError';

const redisClient = new Redis(cacheConfig.config.redis);

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 5,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const resp = await limiter.consume(request.ip);

    response.header({
      'Retry-After': resp.msBeforeNext / 1000,
      'X-RateLimit-Limit': 5,
      'X-RateLimit-Remaining': resp.remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + resp.msBeforeNext),
    });

    return next();
  } catch {
    throw new AppError('Too many requests', 429);
  }
}
