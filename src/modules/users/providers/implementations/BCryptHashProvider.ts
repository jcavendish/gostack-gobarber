import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(info: string, hashedInfo: string): Promise<boolean> {
    return compare(info, hashedInfo);
  }
}

export default BCryptHashProvider;
