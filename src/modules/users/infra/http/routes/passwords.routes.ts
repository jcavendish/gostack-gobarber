import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const routes = Router();

const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

routes.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create
);
routes.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      password: Joi.string().min(4).max(16).required(),
      confirmPassword: Joi.string().required().valid(Joi.ref('password')),
      token: Joi.string().uuid().required(),
    },
  }),
  resetPasswordController.create
);

export default routes;
