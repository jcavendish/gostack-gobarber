import { container } from 'tsyringe';

import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';

import EmailProvider from './EmailProvider/implementations/EtheralEmailProvider';
import IEmailProvider from './EmailProvider/models/IEmailProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider
);

container.registerInstance<IEmailProvider>(
  'EmailProvider',
  new EmailProvider()
);
