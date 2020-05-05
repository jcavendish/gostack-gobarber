import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppoinmentsDTO';
import Appointment from '../infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  repository: Appointment[];

  constructor() {
    this.repository = [];
  }

  public async create({
    providerId,
    date,
  }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointment = Object.assign(new Appointment(), {
      id: uuid(),
      providerId,
      date,
    });
    this.repository.push(appointment);
    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointment = this.repository.find(appointment =>
      isEqual(appointment.date, date)
    );
    return foundAppointment;
  }
}

export default FakeAppointmentsRepository;
