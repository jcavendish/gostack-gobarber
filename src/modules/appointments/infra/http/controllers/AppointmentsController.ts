import { Response, Request } from 'express';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { providerId, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService);
    const appointment = await createAppointment.execute({
      providerId,
      userId,
      date,
    });
    return response.json(appointment);
  }
}

export default AppointmentsController;
