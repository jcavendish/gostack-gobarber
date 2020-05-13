import { Response, Request } from 'express';
import { container } from 'tsyringe';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;

    const listProviders = container.resolve(ListProvidersService);
    const providers = await listProviders.execute({ userId });

    return response.json(providers);
  }
}

export default ProvidersController;
