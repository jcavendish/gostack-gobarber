import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/Users';
import AppError from '../errors/AppError';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const repository = getRepository(User);
    const conflictingEmail = await repository.findOne({ email });

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
