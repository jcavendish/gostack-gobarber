import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  providerId: string;
  date: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    providerId,
    date,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllInDateByProvider(
      {
        providerId,
        date,
        month,
        year,
      }
    );

    return appointments;
  }
}

export default ListProviderAppointmentsService;
