import 'reflect-metadata';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeUsersRepository from '@modules/users/repositories/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

describe('ListProviders', () => {
  it('should list all providers excepted signed in', async () => {
    const providersRepository = new FakeUsersRepository();
    const cacheProvider = new FakeCacheProvider();
    const listProviders = new ListProvidersService(
      providersRepository,
      cacheProvider
    );

    const user1 = await providersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user2 = await providersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '123456',
    });

    const signedInUser = await providersRepository.create({
      name: 'John Qua',
      email: 'johnqua@example.com',
      password: '123456',
    });

    const providers = await listProviders.execute({ userId: signedInUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});
