import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import IHashProvider from '../providers/models/IHashProvider';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';

let usersRepository: FakeUsersRepository;
let hashProvider: IHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(usersRepository, hashProvider);
  });

  it('should be able to update user profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'John Tre',
      email: 'johntre@example.com',
    });

    expect(updatedUser.name).toBe('John Tre');
    expect(updatedUser.email).toBe('johntre@example.com');
  });

  it('should not be able to update user profile when user does not exist', async () => {
    await expect(
      updateProfile.execute({
        userId: 'non-existent-user-id',
        name: 'John Tre',
        email: 'johntre@example.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'John Doe',
      email: 'johndoe@example.com',
      oldPassword: '123456',
      password: '123123',
    });

    expect(updatedUser.name).toBe('John Doe');
    expect(updatedUser.email).toBe('johndoe@example.com');
    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update user password when oldPassword is not provided', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password when oldPassword is wrong', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
        oldPassword: '12345',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
