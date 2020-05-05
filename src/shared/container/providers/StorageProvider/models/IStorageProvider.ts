export default interface IStorageProvider {
  storeFile(fileName: string): Promise<string>;
  deleteFile(fileName: string): Promise<void>;
}
