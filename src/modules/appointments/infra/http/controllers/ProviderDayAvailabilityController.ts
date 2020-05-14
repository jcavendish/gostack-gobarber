import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAvailableHoursService from '@modules/appointments/services/ListProviderAvailableHoursService';

class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { providerId } = request.params;
    const { date, month, year } = request.query;

    const listProviderAvailableHours = container.resolve(
      ListProviderAvailableHoursService
    );

    const availability = await listProviderAvailableHours.execute({
      providerId,
      date: Number(date),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}

export default ProviderDayAvailabilityController;
