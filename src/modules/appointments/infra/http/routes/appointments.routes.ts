import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppoitmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppoitmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      providerId: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  appointmentsController.create
);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
