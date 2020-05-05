import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async storeFile(fileName: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpDirectory, fileName),
      path.resolve(uploadConfig.uploadDirectory, fileName)
    );
    return fileName;
  }

  public async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(uploadConfig.uploadDirectory, fileName);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
