import { Repository, getRepository } from 'typeorm';
import { uuid } from 'uuidv4';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private typeOrmRepository: Repository<UserToken>;

  constructor() {
    this.typeOrmRepository = getRepository(UserToken);
  }

  public async generate(userId: string): Promise<UserToken> {
    const user = this.typeOrmRepository.create({ userId, token: uuid() });
    return this.typeOrmRepository.save(user);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.typeOrmRepository.findOne({ where: { token } });
  }
}

export default UserTokensRepository;
