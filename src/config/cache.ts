import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';

  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: 'redis',
  config: {
    redis: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: undefined,
    },
  },
} as ICacheConfig;
