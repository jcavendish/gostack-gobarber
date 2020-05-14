import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAvailableDatesService from '@modules/appointments/services/ListProviderAvailableDatesService';

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { providerId } = request.params;
    const { month, year } = request.query;

    const listProviderAvailableDates = container.resolve(
      ListProviderAvailableDatesService
    );

    const availability = await listProviderAvailableDates.execute({
      providerId,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}

export default ProviderMonthAvailabilityController;
