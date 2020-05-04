import IAppointmentsRepository, {
  ICreateAppointmentDTO,
} from '@modules/appointments/repositories/IAppointmentsRepository';
import { Repository, getRepository } from 'typeorm';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private typeOrmRepository: Repository<Appointment>;

  constructor() {
    this.typeOrmRepository = getRepository(Appointment);
  }

  public async create(
    appointment: ICreateAppointmentDTO
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
