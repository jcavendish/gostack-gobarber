import { Repository, getRepository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppoinmentsDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private typeOrmRepository: Repository<Appointment>;

  constructor() {
    this.typeOrmRepository = getRepository(Appointment);
  }

  public async create(
    appointment: ICreateAppointmentsDTO
  ): Promise<Appointment> {
    const createdAppointment = this.typeOrmRepository.create(appointment);
    return this.typeOrmRepository.save(createdAppointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointment = await this.typeOrmRepository.findOne({
      date,
    });
    return foundAppointment;
  }
}

export default AppointmentsRepository;
