import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
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
    private hashProvider: IHashProvider
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const conflictingEmail = await this.repository.findByEmail(email);

    if (conflictingEmail) {
      throw new AppError('This e-mail is already in use.');
    }

    const encryptedPassword = await this.hashProvider.generateHash(password);
    const user = this.repository.create({
      name,
      email,
      password: encryptedPassword,
    });

    return user;
  }
}

export default CreateUserService;
