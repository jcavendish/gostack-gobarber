import { Request, Response } from 'express';
import AuthenticateService from '@modules/users/services/AuthenticateService';
import { container } from 'tsyringe';

class AuthenticateController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const authenticate = container.resolve(AuthenticateService);

    const { user, token } = await authenticate.execute({ email, password });
    delete user.password;
    return response.json({ user, token });
  }
}

export default AuthenticateController;
