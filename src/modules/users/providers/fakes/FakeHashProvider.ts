import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(info: string, hashedInfo: string): Promise<boolean> {
    return info === hashedInfo;
  }
}

export default FakeHashProvider;
