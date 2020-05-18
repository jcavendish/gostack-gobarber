import { injectable, inject } from 'tsyringe';
import aws from 'aws-sdk';
import mailConfig from '@config/mail';
import nodemailer, { Transporter } from 'nodemailer';
import ISendEmailProvider from '../models/IEmailProvider';
import IMailTemplateProvider from '../../EmailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
class SESEmailProvider implements ISendEmailProvider {
  client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private emailTemplateProvider: IMailTemplateProvider
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1',
      }),
    });
  }

  public async sendEmail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.emailTemplateProvider.parse(templateData),
    });
  }
}

export default SESEmailProvider;
