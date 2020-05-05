import path from 'path';
import { diskStorage } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

export default {
  tmpDirectory: tmpFolder,
  uploadDirectory: uploadFolder,
  storage: diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.originalname}`;

      callback(null, filename);
    },
  }),
};
