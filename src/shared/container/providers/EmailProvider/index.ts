import { container } from 'tsyringe';
import emailConfig from '@config/mail';
import EtheralEmailProvider from './implementations/EtheralEmailProvider';
import SESEmailProvider from './implementations/SESEmailProvider';
import IEmailProvider from './models/IEmailProvider';

const providers = {
  ethereal: container.resolve(EtheralEmailProvider),
  ses: container.resolve(SESEmailProvider),
};

container.registerInstance<IEmailProvider>(
  'EmailProvider',
  providers[emailConfig.provider]
);
