import IMailTemplateProvider from '../models/IMailTemplateProvider';

class FakeEmailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'MailTemplate';
  }
}

export default FakeEmailTemplateProvider;
