import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import ProfileController from '../controllers/ProfileController';

const routes = Router();
const profileController = new ProfileController();

routes.use(ensureAuthenticated);

routes.get('/', profileController.show);
routes.put(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      oldPassword: Joi.string().min(4).max(16),
      password: Joi.string().min(4).max(16),
      confirmPassword: Joi.string().valid(Joi.ref('password')),
    }).with('password', ['oldPassword', 'confirmPassword']),
  }),
  profileController.update
);

export default routes;
