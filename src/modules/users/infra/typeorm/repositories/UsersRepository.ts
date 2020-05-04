import IUserRepository from '@modules/users/repositories/IUsersRepository';
import { Repository, getRepository } from 'typeorm';
import User from '../entities/Users';

class UsersRepository implements IUserRepository {
  private typeOrmRepository: Repository<User>;

  constructor() {
    this.typeOrmRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.typeOrmRepository.findOne(id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.typeOrmRepository.findOne({ email });
    return user;
  }

  public async update(user: User): Promise<User> {
    return this.typeOrmRepository.save(user);
  }
}

export default UsersRepository;
