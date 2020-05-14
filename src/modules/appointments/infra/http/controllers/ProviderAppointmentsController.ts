import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

class ProviderAppoitmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: providerId } = request.user;
    const { date, month, year } = request.query;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService
    );

    const availability = await listProviderAppointments.execute({
      providerId,
      date: Number(date),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}

export default ProviderAppoitmentsController;
