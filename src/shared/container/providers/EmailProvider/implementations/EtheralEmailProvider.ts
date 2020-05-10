import nodemailer, { Transporter } from 'nodemailer';
import ISendEmailProvider from '../models/IEmailProvider';

class EtheralEmailProvider implements ISendEmailProvider {
  client: Transporter;

  constructor() {
    nodemailer.createTestAccount((err, account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendEmail(
    to: string,
    body: string,
    token: string
  ): Promise<void> {
    const message = await this.client.sendMail({
      from: 'equipe@gobarber.com',
      to,
      subject: `You have requested to change your password: ${token}`,
      text: body,
    });

    console.log('Message sent: %s', message.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default EtheralEmailProvider;
