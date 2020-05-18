import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';

import EtheralEmailProvider from './EmailProvider/implementations/EtheralEmailProvider';
import SESEmailProvider from './EmailProvider/implementations/SESEmailProvider';
import IEmailProvider from './EmailProvider/models/IEmailProvider';

import IMailTemplateProvider from './EmailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './EmailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider
);

container.registerInstance<IEmailProvider>(
  'EmailProvider',
  mailConfig.provider === 'ses'
    ? container.resolve(SESEmailProvider)
    : container.resolve(EtheralEmailProvider)
);
