import { uuid } from 'uuidv4';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUsersDTO';
import User from '../infra/typeorm/entities/User';
import IListProviderDTO from '../dtos/IListProviderDTO';

class FakeUsersRepository implements IUserRepository {
  protected repository: User[];

  constructor() {
    this.repository = [];
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = Object.assign(new User(), {
      id: uuid(),
      name,
      email,
      password,
    });
    this.repository.push(user);
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const foundUser = this.repository.find(user => user.id === id);
    return foundUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const foundUser = this.repository.find(user => user.email === email);
    return foundUser;
  }

  public async update(user: User): Promise<User> {
    this.repository = this.repository.map(eachUser => {
      if (eachUser.id === user.id) {
        return user;
      }
      return eachUser;
    });
    return user;
  }

  public async findAllProvidersExcept({
    exceptedProviderId,
  }: IListProviderDTO): Promise<User[]> {
    return this.repository.filter(user => user.id !== exceptedProviderId);
  }
}

export default FakeUsersRepository;
