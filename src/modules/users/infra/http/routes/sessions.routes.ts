import { Router } from 'express';
import AuthenticateController from '../controllers/AuthenticateController';

const sessionsRouter = Router();
const authenticateController = new AuthenticateController();

sessionsRouter.post('/', authenticateController.create);

export default sessionsRouter;
