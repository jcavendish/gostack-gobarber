import 'reflect-metadata';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ListProviderAvailableDatesService from './ListProviderAvailableDatesService';
import FakeAppointmentsRepository from '../repositories/FakeAppointmentsRepository';

let appointmentsRepository: IAppointmentsRepository;
let listProviderAvailableDates: ListProviderAvailableDatesService;

describe('ListProviderAvailableDates', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    listProviderAvailableDates = new ListProviderAvailableDatesService(
      appointmentsRepository
    );
  });

  it('should be able to list the dates where the provider has at least one availability', async () => {
    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 12, 8, 0, 0),
    });

    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 12, 9, 0, 0),
    });

    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 12, 10, 0, 0),
    });

    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 12, 11, 0, 0),
    });

    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 12, 12, 0, 0),
    });

    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 12, 13, 0, 0),
    });

    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 12, 14, 0, 0),
    });

    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 12, 15, 0, 0),
    });

    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 12, 16, 0, 0),
    });

    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 12, 17, 0, 0),
    });

    await appointmentsRepository.create({
      providerId: 'test-provider-1',
      userId: 'test-user-1',
      date: new Date(2020, 4, 13, 8, 0, 0),
    });

    const datesAvailability = await listProviderAvailableDates.execute({
      providerId: 'test-provider-1',
      month: 5,
      year: 2020,
    });

    expect(datesAvailability).toEqual(
      expect.arrayContaining([
        {
          date: 12,
          available: false,
        },
        {
          date: 13,
          available: true,
        },
      ])
    );
  });
});
