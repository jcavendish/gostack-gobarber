import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { to, body } = request.body;
    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService
    );
    await sendForgotPasswordEmail.execute(to, body);

    return response.sendStatus(204);
  }
}

export default ForgotPasswordController;
