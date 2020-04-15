import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/Users';
import authConfig from '../config/auth';

interface RequestDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  user: User;
  token: string;
}

class AuthenticateService {
  public async execute({ email, password }: RequestDTO): Promise<ResponseDTO> {
    const authenticatedUser = await getRepository(User).findOne({ email });

    if (!authenticatedUser) {
      throw new Error('E-mail or password incorrect');
    }

    const isPasswordValid = await compare(password, authenticatedUser.password);
    if (!isPasswordValid) {
      throw new Error('E-mail or password incorrect');
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
