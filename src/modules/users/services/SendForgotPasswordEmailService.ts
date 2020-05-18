import path from 'path';
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

  public async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('The user does not exist');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const templateFile = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs'
    );

    await this.emailProvider.sendEmail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: templateFile,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset?token=${token}`,
          senderName: 'Equipe GoBarber',
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
