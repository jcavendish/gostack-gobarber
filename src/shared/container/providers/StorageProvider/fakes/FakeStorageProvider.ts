import IStorageProvider from '../models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  storage: string[];

  constructor() {
    this.storage = [];
  }

  public async storeFile(fileName: string): Promise<string> {
    this.storage.push(fileName);
    return fileName;
  }

  public async deleteFile(fileName: string): Promise<void> {
    this.storage = this.storage.filter(file => file === fileName);
  }
}

export default FakeStorageProvider;
