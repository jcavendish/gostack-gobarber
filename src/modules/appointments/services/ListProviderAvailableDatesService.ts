import { injectable, inject } from 'tsyringe';
import { getDate, getDaysInMonth } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  providerId: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  date: number;
  available: boolean;
}>;

interface ILookUpAppointments {
  [key: number]: Appointment[];
}

@injectable()
class ListProviderAvailableDatesService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    providerId,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthByProvider(
      {
        providerId,
        month,
        year,
      }
    );

    const numberOfDays = getDaysInMonth(month - 1);

    const arrayOfDays = Array.from(
      { length: numberOfDays },
      (_, index) => index + 1
    );

    const lookUpAppointments: ILookUpAppointments = arrayOfDays.reduce(
      (lookUp, day) => {
        const dateKey = lookUp;
        dateKey[day] = [];
        return dateKey;
      },
      {} as ILookUpAppointments
    );

    appointments.forEach(appointment => {
      const appointmentsInDate = lookUpAppointments[getDate(appointment.date)];
      appointmentsInDate.push(appointment);
    });

    return arrayOfDays.map(date => {
      const isAvailable = lookUpAppointments[date].length < 10;
      return { date, available: isAvailable };
    });
  }
}

export default ListProviderAvailableDatesService;
