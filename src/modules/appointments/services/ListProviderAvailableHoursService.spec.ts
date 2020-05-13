import 'reflect-metadata';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import FakeAppointmentsRepository from '../repositories/FakeAppointmentsRepository';
import ListProviderAvailableHoursService from './ListProviderAvailableHoursService';

let appointmentsRepository: IAppointmentsRepository;
let listProviderAvailableHours: ListProviderAvailableHoursService;

describe('ListProviderAvailableHours', () => {
  beforeEach(async () => {
    appointmentsRepository = new FakeAppointmentsRepository();
    listProviderAvailableHours = new ListProviderAvailableHoursService(
      appointmentsRepository
    );

    const schedulesHours = Array.from({ length: 10 }, (_, index) => index + 10);

    const promises = schedulesHours.map(scheduledHour =>
      appointmentsRepository.create({
        providerId: 'test-provider-1',
        userId: 'test-user-id-1',
        date: new Date(2020, 4, 12, scheduledHour, 0, 0),
      })
    );

    await Promise.all(promises);
  });

  it('should be able to list the hours where the provider has at least one availability', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 12, 0, 0).getTime());

    const datesAvailability = await listProviderAvailableHours.execute({
      providerId: 'test-provider-1',
      date: 12,
      month: 5,
      year: 2020,
    });

    expect(datesAvailability).toEqual(
      expect.arrayContaining([
        {
          hour: 8,
          available: true,
        },
        {
          hour: 9,
          available: true,
        },
        {
          hour: 10,
          available: false,
        },
        {
          hour: 13,
          available: false,
        },
        {
          hour: 14,
          available: false,
        },
        {
          hour: 15,
          available: false,
        },
        {
          hour: 16,
          available: false,
        },
        {
          hour: 17,
          available: false,
        },
      ])
    );
  });

  it('should not be able to list the hours passed hours even when available', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 12, 13, 0).getTime());

    const datesAvailability = await listProviderAvailableHours.execute({
      providerId: 'test-provider-1',
      date: 12,
      month: 5,
      year: 2020,
    });

    expect(datesAvailability).toEqual(
      expect.arrayContaining([
        {
          hour: 8,
          available: false,
        },
        {
          hour: 9,
          available: false,
        },
        {
          hour: 10,
          available: false,
        },
      ])
    );
  });
});
