import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import UpdateAvatarService from './UpdateAvatarService';
import IUsersRepository from '../repositories/IUsersRepository';

let userRepository: IUsersRepository;
let storageProvider: IStorageProvider;
let updateAvatar: UpdateAvatarService;

describe('UpdateAvatar', () => {
  beforeEach(() => {
    userRepository = new FakeUsersRepository();
    storageProvider = new FakeStorageProvider();
    updateAvatar = new UpdateAvatarService(userRepository, storageProvider);
  });
  it('should update user avatar', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@emai.com',
      password: '12345',
    });

    await updateAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
      avatarSize: 1000,
    });

    expect(user).toHaveProperty('id');
    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not update when user not known', async () => {
    await expect(
      updateAvatar.execute({
        userId: 'non-existent-id',
        avatarFilename: 'avatar.jpg',
        avatarSize: 1000,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not update user avatar when it is larger than 2_000_000', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@emai.com',
      password: '12345',
    });

    await expect(
      updateAvatar.execute({
        userId: user.id,
        avatarFilename: 'avatar.jpg',
        avatarSize: 2_000_001,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should update user avatar and delete old when it exists', async () => {
    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@emai.com',
      password: '12345',
    });

    await updateAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
      avatarSize: 1000,
    });

    await updateAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar2.jpg',
      avatarSize: 1000,
    });

    expect(user).toHaveProperty('id');
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
