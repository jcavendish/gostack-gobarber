import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeEmailProvider from '../../../shared/container/providers/EmailProvider/fakes/FakeEmailProvider';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/FakeUserTokensRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';

let emailProvider: IEmailProvider;
let usersRepository: IUsersRepository;
let userTokensRepository: IUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    emailProvider = new FakeEmailProvider();
    usersRepository = new FakeUsersRepository();
    userTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      emailProvider,
      usersRepository,
      userTokensRepository
    );
  });
  it('should be able to recover the password using e-mail', async () => {
    const sendEmail = jest.spyOn(emailProvider, 'sendEmail');

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute('johndoe@example.com');

    expect(sendEmail).toHaveBeenCalled();
  });

  it('shoul not be able to recover a non-existent user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute('johndoe@example.com')
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generate = jest.spyOn(userTokensRepository, 'generate');

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute('johndoe@example.com');

    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
