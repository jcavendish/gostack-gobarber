import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/Users';
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
    private repository: IUsersRepository
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
      throw new Error('The image is larger than the maximum size of 2MB');
    }

    this.deleteIfExists(user.avatar);

    user.avatar = avatarFilename;
    await this.repository.update(user);

    return user;
  }

  private async deleteIfExists(avatar: string): Promise<void> {
    if (avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, avatar);
      const userAvatarExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
  }
}
export default UpdateAvatarService;
