import ISendEmailProvider from '../models/IEmailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

class FakeEmailProvider implements ISendEmailProvider {
  sentMails: ISendMailDTO[] = [];

  public async sendEmail(emailData: ISendMailDTO): Promise<void> {
    this.sentMails.push(emailData);
  }
}

export default FakeEmailProvider;
