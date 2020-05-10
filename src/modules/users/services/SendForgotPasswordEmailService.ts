import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IEmailProvider from '../../../shared/container/providers/EmailProvider/models/IEmailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('EmailProvider')
    private emailProvider: IEmailProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}

  public async execute(to: string, body: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(to);

    if (!user) {
      throw new AppError('The user does not exist');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    await this.emailProvider.sendEmail(to, body, token);
  }
}

export default SendForgotPasswordEmailService;
