import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import ShowProfileService from './ShowProfileService';

let usersRepository: IUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(usersRepository);
  });

  it('should be able to show signed in user profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const foundUser = await showProfile.execute(user.id);

    expect(foundUser).toEqual(user);
  });

  it('should not be able to show non-existent user profile', async () => {
    await expect(
      showProfile.execute('on-existent-user-id')
    ).rejects.toBeInstanceOf(AppError);
  });
});
