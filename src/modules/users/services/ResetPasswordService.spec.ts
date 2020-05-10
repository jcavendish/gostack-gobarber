import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import FakeUserTokensRepository from '../repositories/FakeUserTokensRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import IHashProvider from '../providers/models/IHashProvider';

let usersRepository: IUsersRepository;
let userTokensRepository: IUserTokensRepository;
let hashProvider: IHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    userTokensRepository = new FakeUserTokensRepository();
    hashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      usersRepository,
      userTokensRepository,
      hashProvider
    );
  });

  it('should be able to reset user password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    await resetPassword.execute('123123', token);

    const updatedUser = await usersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('123123');
  });

  it('should be able to generate hashed password', async () => {
    const generateHash = jest.spyOn(hashProvider, 'generateHash');

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    await resetPassword.execute('123123', token);

    const updatedUser = await usersRepository.findById(user.id);

    expect(generateHash).toHaveBeenLastCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset password with unexisting user token', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      resetPassword.execute('123123', 'unexisting-token')
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with unexisting user', async () => {
    const { token } = await userTokensRepository.generate('unexisting-user-id');

    await expect(resetPassword.execute('123123', token)).rejects.toBeInstanceOf(
      AppError
    );
  });

  it('should not be able to reset password with token generated longer than 2h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const now = new Date();
      return now.setHours(now.getHours() + 3);
    });

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    await expect(resetPassword.execute('123123', token)).rejects.toBeInstanceOf(
      AppError
    );
  });
});
