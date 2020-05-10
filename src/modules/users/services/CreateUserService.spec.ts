import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

describe('CreateUserService', () => {
  it('should be able to create an user', async () => {
    const userRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(userRepository, hashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@email.com');
  });

  it('should not be able to create an user whith same email as another', async () => {
    const userRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(userRepository, hashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'John Doe 2',
        email: 'johndoe@email.com',
        password: '1234567',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
