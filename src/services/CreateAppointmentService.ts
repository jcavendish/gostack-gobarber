import { startOfHour } from 'date-fns';

import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider, date }: RequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const repository = getCustomRepository(AppointmentsRepository);
    const conflictingAppointment = await repository.findByDate(appointmentDate);

    if (conflictingAppointment) {
      throw Error(
        'The time of this appointment is not available. Please try another time.'
      );
    }
    const appointment = repository.create({ provider, date: appointmentDate });
    await repository.save(appointment);
    return appointment;
  }
}

export default CreateAppointmentService;
