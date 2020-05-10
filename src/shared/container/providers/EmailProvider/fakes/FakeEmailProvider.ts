import ISendEmailProvider from '../models/IEmailProvider';

interface IEmail {
  to: string;
  body: string;
}

class FakeEmailProvider implements ISendEmailProvider {
  sentMails: IEmail[] = [];

  public async sendEmail(to: string, body: string): Promise<void> {
    this.sentMails.push({
      to,
      body,
    });
  }
}

export default FakeEmailProvider;
