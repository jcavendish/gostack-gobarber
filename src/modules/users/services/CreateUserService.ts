import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private repository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const conflictingEmail = await this.repository.findByEmail(email);

    if (conflictingEmail) {
      throw new AppError('This e-mail is already in use.');
    }

    const encryptedPassword = await this.hashProvider.generateHash(password);
    const user = await this.repository.create({
      name,
      email,
      password: encryptedPassword,
    });

    this.cacheProvider.invalidatePrefix(`providers`);

    return user;
  }
}

export default CreateUserService;
