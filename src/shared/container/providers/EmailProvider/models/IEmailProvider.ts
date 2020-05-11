import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IEmailProvider {
  sendEmail(emailData: ISendMailDTO): Promise<void>;
}
