import { Repository, getRepository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppoinmentsDTO';
import IFindAllInMonthByProviderDTO from '@modules/appointments/dtos/IFindAllInMonthByProviderDTO';
import IFindAllInDateByProviderDTO from '@modules/appointments/dtos/IFindAllInDateByProviderDTO';
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

  public async findAllInMonthByProvider({
    providerId,
    month,
    year,
  }: IFindAllInMonthByProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    return this.typeOrmRepository.find({
      where: {
        providerId,
        date: Raw(
          dateField =>
            `to_char(${dateField}, MM-YYYY) = '${parsedMonth}-${year}'`
        ),
      },
    });
  }

  public async findAllInDateByProvider({
    providerId,
    date,
    month,
    year,
  }: IFindAllInDateByProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDate = String(date).padStart(2, '0');

    return this.typeOrmRepository.find({
      where: {
        providerId,
        date: Raw(
          dateField =>
            `to_char(${dateField}, HH-MM-YYYY) = '${parsedDate}-${parsedMonth}-${year}'`
        ),
      },
    });
  }
}

export default AppointmentsRepository;
