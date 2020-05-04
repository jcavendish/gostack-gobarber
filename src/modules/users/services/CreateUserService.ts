import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private repository: IUsersRepository
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const repository = getRepository(User);
    const conflictingEmail = await this.repository.findByEmail(email);

    if (conflictingEmail) {
      throw new AppError('This e-mail is already in use.');
    }
    const encryptedPassword = await hash(password, 8);
    const user = repository.create({
      name,
      email,
      password: encryptedPassword,
    });
    await repository.save(user);

    return user;
  }
}

export default CreateUserService;
