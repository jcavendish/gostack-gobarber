import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository';

interface IRequest {
  providerId: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private repository: AppointmentsRepository
  ) {}

  public async execute({ providerId, date }: IRequest): Promise<Appointment> {
    if (!providerId) {
      throw new AppError('The appointment must have a provider');
    }

    const appointmentDate = startOfHour(date);

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
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
