import { Router } from 'express';
import { AdvancedConsoleLogger } from 'typeorm';
import AuthenticateService from '../services/AuthenticateService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;
    const authenticate = new AuthenticateService();
    const { user, token } = await authenticate.execute({ email, password });
    return response.json({ user, token });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default sessionsRouter;
