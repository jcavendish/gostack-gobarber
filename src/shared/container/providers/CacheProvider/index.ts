import { container } from 'tsyringe';
import RedisCacheProvider from './implementations/RedisCacheProvider';
import ICacheProvider from './models/ICacheProvider';

const provider = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>('CacheProvider', provider.redis);
