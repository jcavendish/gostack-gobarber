import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/Users';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface RequestDTO {
  userId: string;
  avatarFilename: string;
  avatarSize: number;
}

const MAXIMUM_SIZE = 2_000_000;

class UpdateAvatarService {
  public async execute({
    userId,
    avatarFilename,
    avatarSize,
  }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: userId });

    if (!user) {
      throw new AppError('You must be authenticated', 401);
    }

    if (avatarSize > MAXIMUM_SIZE) {
      throw new Error('The image is larger than the maximum size of 2MB');
    }

    this.deleteIfExists(user.avatar);

    user.avatar = avatarFilename;
    await userRepository.save(user);

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
