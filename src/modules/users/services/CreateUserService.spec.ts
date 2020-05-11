import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/models/IHashProvider';

let userRepository: IUsersRepository;
let hashProvider: IHashProvider;
let createUser: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    userRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    createUser = new CreateUserService(userRepository, hashProvider);
  });

  it('should be able to create an user', async () => {
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
