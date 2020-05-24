import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppoinmentsDTO';
import Appointment from '../infra/typeorm/entities/Appointment';
import IFindAllInMonthByProviderDTO from '../dtos/IFindAllInMonthByProviderDTO';
import IFindAllInDateByProviderDTO from '../dtos/IFindAllInDateByProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  repository: Appointment[];

  constructor() {
    this.repository = [];
  }

  public async create({
    providerId,
    userId,
    date,
  }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointment = Object.assign(new Appointment(), {
      id: uuid(),
      providerId,
      userId,
      date,
    });
    this.repository.push(appointment);
    return appointment;
  }

  public async findByDate(
    providerId: string,
    date: Date
  ): Promise<Appointment | undefined> {
    const foundAppointment = this.repository.find(
      appointment =>
        providerId === appointment.providerId && isEqual(appointment.date, date)
    );
    return foundAppointment;
  }

  public async findAllInMonthByProvider({
    providerId,
    month,
    year,
  }: IFindAllInMonthByProviderDTO): Promise<Appointment[]> {
    const foundAppointments = this.repository.filter(appointment => {
      return (
        appointment.providerId === providerId &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return foundAppointments;
  }

  public async findAllInDateByProvider({
    providerId,
    date,
    month,
    year,
  }: IFindAllInDateByProviderDTO): Promise<Appointment[]> {
    const foundAppointments = this.repository.filter(appointment => {
      return (
        appointment.providerId === providerId &&
        getDate(appointment.date) === date &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return foundAppointments;
  }
}

export default FakeAppointmentsRepository;
