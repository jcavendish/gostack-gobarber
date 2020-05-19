import ICacheProvider from '../models/ICacheProvider';

interface ICacheClient {
  [key: string]: string;
}

class FakeCacheProvider implements ICacheProvider {
  client: ICacheClient = {};

  public async save(key: string, value: any): Promise<void> {
    this.client[key] = JSON.stringify(value);
  }

  public async retrieve<T>(key: string): Promise<T | null> {
    const value = this.client[key];

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.client[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.client);

    keys
      .filter(key => key.startsWith(`${prefix}:`))
      .forEach(key => delete this.client[key]);
  }
}

export default FakeCacheProvider;
