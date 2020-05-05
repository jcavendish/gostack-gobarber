import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import AuthenticateService from './AuthenticateService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

describe('AuthenticateService', () => {
  it('should authenticate user', async () => {
    const userRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(userRepository, hashProvider);
    const authenticate = new AuthenticateService(userRepository, hashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345',
    });

    const response = await authenticate.execute({
      email: 'johndoe@email.com',
      password: '12345',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not authenticate user when user does not exist', async () => {
    const userRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const authenticate = new AuthenticateService(userRepository, hashProvider);

    expect(
      authenticate.execute({
        email: 'johndoe@email.com',
        password: '12345',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not authenticate user when password is wrong', async () => {
    const userRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(userRepository, hashProvider);
    const authenticate = new AuthenticateService(userRepository, hashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345',
    });

    expect(
      authenticate.execute({
        email: 'johndoe@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
