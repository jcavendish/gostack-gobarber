export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(info: string, hashedInfo: string): Promise<boolean>;
}
