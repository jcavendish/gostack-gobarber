import IUserRepository from '@modules/users/repositories/IUsersRepository';
import { Repository, getRepository } from 'typeorm';
import ICreateUserDTO from '@modules/users/dtos/ICreateUsersDTO';
import User from '../entities/User';

class UsersRepository implements IUserRepository {
  private typeOrmRepository: Repository<User>;

  constructor() {
    this.typeOrmRepository = getRepository(User);
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.typeOrmRepository.create({ name, email, password });
    return this.typeOrmRepository.save(user);
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
