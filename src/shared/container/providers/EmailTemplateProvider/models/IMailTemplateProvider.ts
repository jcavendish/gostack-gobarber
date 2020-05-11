import IParseEmailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(template: IParseEmailTemplateDTO): Promise<string>;
}
