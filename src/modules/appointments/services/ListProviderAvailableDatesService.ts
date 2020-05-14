import { injectable, inject } from 'tsyringe';
import { getDate, getDaysInMonth, isBefore, startOfDay } from 'date-fns';
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

    const currentDate = new Date(Date.now());

    return arrayOfDays.map(date => {
      const requestedDate = new Date(year, month - 1, date);
      const isNotPastDate = !isBefore(requestedDate, startOfDay(currentDate));

      const isAvailable = lookUpAppointments[date].length < 10;

      return { date, available: isAvailable && isNotPastDate };
    });
  }
}

export default ListProviderAvailableDatesService;
