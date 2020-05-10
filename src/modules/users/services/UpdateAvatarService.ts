import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  userId: string;
  avatarFilename: string;
  avatarSize: number;
}

const MAXIMUM_SIZE = 2_000_000;

@injectable()
class UpdateAvatarService {
  constructor(
    @inject('UsersRepository')
    private repository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({
    userId,
    avatarFilename,
    avatarSize,
  }: IRequest): Promise<User> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new AppError('You must be authenticated', 401);
    }

    if (avatarSize > MAXIMUM_SIZE) {
      throw new AppError('The image is larger than the maximum size of 2MB');
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.storeFile(avatarFilename);

    user.avatar = fileName;
    await this.repository.update(user);

    return user;
  }
}
export default UpdateAvatarService;
