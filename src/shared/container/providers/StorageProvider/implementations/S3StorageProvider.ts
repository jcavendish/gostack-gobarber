import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async storeFile(fileName: string): Promise<string> {
    const originalName = path.resolve(uploadConfig.tmpDirectory, fileName);

    const contentType = mime.getType(fileName);

    if (!contentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalName);

    await this.client
      .putObject({
        Bucket: 'gobarber-avatars',
        Key: fileName,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
      })
      .promise();

    await fs.promises.unlink(originalName);

    return fileName;
  }

  public async deleteFile(fileName: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: 'gobarber-avatars',
        Key: fileName,
      })
      .promise();
  }
}

export default S3StorageProvider;
