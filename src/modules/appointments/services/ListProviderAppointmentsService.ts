import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
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
    private appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    providerId,
    date,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const cachekey = `appointments:${providerId}:${year}-${month}-${date}`;

    let appointments = await this.cacheProvider.retrieve<Appointment[]>(
      cachekey
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDateByProvider({
        providerId,
        date,
        month,
        year,
      });

      await this.cacheProvider.save(cachekey, appointments);
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
