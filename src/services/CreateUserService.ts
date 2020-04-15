import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/Users';

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
      throw new Error('This e-mail is already in use.');
    }
    const encryptedPassword = await hash(password, 8);
    const user = repository.create({
      name,
      email,
      password: encryptedPassword,
    });
    await repository.save(user);

    delete user.password;

    return user;
  }
}

export default CreateUserService;
