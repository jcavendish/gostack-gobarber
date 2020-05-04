import { Response, Request } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { providerId, date } = request.body;
    const parsedDate = parseISO(date);
    const createAppointment = container.resolve(CreateAppointmentService);
    const appointment = await createAppointment.execute({
      providerId,
      date: parsedDate,
    });
    return response.json(appointment);
  }
}

export default AppointmentsController;
