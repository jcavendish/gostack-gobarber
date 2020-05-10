export default interface IEmailProvider {
  sendEmail(to: string, body: string, token: string): Promise<void>;
}
