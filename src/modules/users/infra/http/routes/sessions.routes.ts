import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import AuthenticateController from '../controllers/AuthenticateController';

const sessionsRouter = Router();
const authenticateController = new AuthenticateController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(16).required(),
    },
  }),
  authenticateController.create
);

export default sessionsRouter;
