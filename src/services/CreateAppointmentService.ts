import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  repository: AppointmentsRepository;

  constructor(repository: AppointmentsRepository) {
    this.repository = repository;
  }

  public execute({ provider, date }: RequestDTO): Appointment {
    const appointmentDate = startOfHour(date);
    const conflictingAppointment = this.repository.findByDate(appointmentDate);

    if (conflictingAppointment) {
      throw Error(
        'The time of this appointment is not available. Please try another time.'
      );
    }
    return this.repository.create({ provider, date: appointmentDate });
  }
}

export default CreateAppointmentService;
