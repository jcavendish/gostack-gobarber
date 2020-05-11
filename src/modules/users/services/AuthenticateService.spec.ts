import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import AuthenticateService from './AuthenticateService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/models/IHashProvider';

let userRepository: IUsersRepository;
let hashProvider: IHashProvider;
let createUser: CreateUserService;
let authenticate: AuthenticateService;

describe('AuthenticateService', () => {
  beforeEach(() => {
    userRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    createUser = new CreateUserService(userRepository, hashProvider);
    authenticate = new AuthenticateService(userRepository, hashProvider);
  });

  it('should authenticate user', async () => {
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
    await expect(
      authenticate.execute({
        email: 'johndoe@email.com',
        password: '12345',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not authenticate user when password is wrong', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345',
    });

    await expect(
      authenticate.execute({
        email: 'johndoe@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
