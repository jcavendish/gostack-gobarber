import path from 'path';
import { diskStorage, StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

interface IStorageConfig {
  driver: 'disk' | 's3';

  tmpDirectory: string;
  uploadDirectory: string;

  multer: {
    storage: StorageEngine;
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  tmpDirectory: tmpFolder,
  uploadDirectory: uploadFolder,

  multer: {
    storage: diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.originalname}`;

        callback(null, filename);
      },
    }),
  },
} as IStorageConfig;
