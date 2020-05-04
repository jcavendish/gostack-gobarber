import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateService {
  constructor(
    @inject('UsersRepository')
    private repository: IUsersRepository
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const authenticatedUser = await this.repository.findByEmail(email);

    if (!authenticatedUser) {
      throw new AppError('E-mail or password incorrect');
    }

    const isPasswordValid = await compare(password, authenticatedUser.password);
    if (!isPasswordValid) {
      throw new AppError('E-mail or password incorrect');
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: authenticatedUser.id,
      expiresIn,
    });

    delete authenticatedUser.password;

    return { user: authenticatedUser, token };
  }
}

export default AuthenticateService;
