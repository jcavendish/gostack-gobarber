import { startOfHour } from 'date-fns';

import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
  providerId: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ providerId, date }: RequestDTO): Promise<Appointment> {
    if (!providerId) {
      throw new Error('The appointment must have a provider');
    }

    const appointmentDate = startOfHour(date);
    const repository = getCustomRepository(AppointmentsRepository);
    const conflictingAppointment = await repository.findByDate(appointmentDate);

    if (conflictingAppointment) {
      throw new Error(
        'The time of this appointment is not available. Please try another time.'
      );
    }
    const appointment = repository.create({
      providerId,
      date: appointmentDate,
    });
    await repository.save(appointment);
    return appointment;
  }
}

export default CreateAppointmentService;