import { isEqual } from 'date-fns';
import AppError from '@shared/errors/AppError';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeAppointmentsRepository from '../repositories/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

let appointmentsRepository: IAppointmentsRepository;
let notificationsRepository: INotificationsRepository;
let cacheProvider: ICacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    notificationsRepository = new FakeNotificationsRepository();
    cacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      appointmentsRepository,
      notificationsRepository,
      cacheProvider
    );
  });

  it('Should be able to create an appointment', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 5, 9).getTime());

    const appointment = await createAppointment.execute({
      providerId: 'provider-id',
      userId: 'user-id',
      date: new Date(2020, 4, 5, 10),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('provider-id');
    expect(appointment.userId).toBe('user-id');
    expect(isEqual(appointment.date, new Date(2020, 4, 5, 10))).toBeTruthy();
  });

  it('Should be able to create a notification to the provider', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 5, 9).getTime());

    const createNotification = jest.spyOn(notificationsRepository, 'create');

    await createAppointment.execute({
      providerId: 'provider-id',
      userId: 'user-id',
      date: new Date(2020, 4, 5, 10),
    });

    expect(createNotification).toBeCalled();
  });

  it('Should not be able to create an appointment with the same time', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 5, 9).getTime());

    await createAppointment.execute({
      providerId: 'provider-id',
      userId: 'user-id',
      date: new Date(2020, 4, 5, 10),
    });

    await expect(
      createAppointment.execute({
        providerId: 'provider-id',
        userId: 'user-id',
        date: new Date(2020, 4, 5, 10),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('it should not be able to create an appointment on a past date', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 10).getTime());

    await expect(
      createAppointment.execute({
        providerId: 'provider-id',
        userId: 'user-id',
        date: new Date(2020, 4, 5, 10),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('it should not be able to create an appointment with same user as provider', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 5, 9).getTime());

    await expect(
      createAppointment.execute({
        providerId: 'provider-user-id',
        userId: 'provider-user-id',
        date: new Date(2020, 4, 5, 10),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('it should not be able to create an appointment before 8am or after 5pm', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 5, 0).getTime());

    const firstWorkingHour = 8;
    const lastWorkingHour = 17;

    await expect(
      createAppointment.execute({
        providerId: 'provider-id',
        userId: 'user-id',
        date: new Date(2020, 4, 5, firstWorkingHour - 1),
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        providerId: 'provider-id',
        userId: 'user-id',
        date: new Date(2020, 4, 5, lastWorkingHour + 1),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
