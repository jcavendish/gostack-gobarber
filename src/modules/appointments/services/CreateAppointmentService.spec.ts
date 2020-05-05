import { isEqual } from 'date-fns';
import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('Should be able to create an appointment', async () => {
    const appointmentRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentRepository
    );
    const appointment = await createAppointment.execute({
      providerId: '12345',
      date: new Date(2020, 4, 5, 10),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('12345');
    expect(isEqual(appointment.date, new Date(2020, 4, 5, 10))).toBeTruthy();
  });

  it('Should not be able to create an appointment without a provider', async () => {
    const appointmentRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentRepository
    );

    expect(
      createAppointment.execute({
        providerId: '',
        date: new Date(2020, 4, 5, 10),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment with the same time', async () => {
    const appointmentRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentRepository
    );
    await createAppointment.execute({
      providerId: '12345',
      date: new Date(2020, 4, 5, 10),
    });

    expect(
      createAppointment.execute({
        providerId: '12345',
        date: new Date(2020, 4, 5, 10),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
