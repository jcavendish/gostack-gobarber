import { startOfHour, isBefore, isAfter, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  userId: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private repository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    providerId,
    userId,
    date,
  }: IRequest): Promise<Appointment> {
    if (userId === providerId) {
      throw new AppError('You cannot create an appointment with yourself');
    }

    const currentDate = Date.now();
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, currentDate)) {
      throw new AppError('You cannot create an appointment on a past date');
    }

    const firstWorkingHour = 8;
    const lastWorkingHour = 17;
    const appointmentHour = getHours(appointmentDate);

    if (
      isBefore(appointmentHour, firstWorkingHour) ||
      isAfter(appointmentHour, lastWorkingHour)
    ) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm'
      );
    }

    const conflictingAppointment = await this.repository.findByDate(
      appointmentDate
    );

    if (conflictingAppointment) {
      throw new AppError(
        'The time of this appointment is not available. Please try another time.'
      );
    }

    const appointment = await this.repository.create({
      providerId,
      userId,
      date: appointmentDate,
    });

    const cacheFormattedDate = format(appointmentDate, 'yyyy-M-d');
    const cachekey = `appointments:${providerId}:${cacheFormattedDate}`;
    this.cacheProvider.invalidate(cachekey);

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH'h'");

    this.notificationsRepository.create({
      recipientId: providerId,
      content: `Um novo agendamento foi feito no dia ${formattedDate}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
