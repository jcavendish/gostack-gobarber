import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  date: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

interface ILookUpAppointments {
  [key: number]: boolean;
}

@injectable()
class ListProviderAvailableHoursService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    providerId,
    date,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDateByProvider(
      {
        providerId,
        date,
        month,
        year,
      }
    );

    const startHour = 8;
    const rangeHours = 10;

    const arrayOfHours = Array.from(
      { length: rangeHours },
      (_, index) => index + startHour
    );

    const lookUpAppointments: ILookUpAppointments = arrayOfHours.reduce(
      (lookUp, hour) => {
        const hourKey = lookUp;
        hourKey[hour] = false;
        return hourKey;
      },
      {} as ILookUpAppointments
    );

    appointments.forEach(appointment => {
      lookUpAppointments[getHours(appointment.date)] = true;
    });

    const currentDate = new Date(Date.now());

    return arrayOfHours.map(hour => {
      const isFutureDate = isAfter(hour, getHours(currentDate));

      const available = isFutureDate && !lookUpAppointments[hour];
      return { hour, available };
    });
  }
}

export default ListProviderAvailableHoursService;
