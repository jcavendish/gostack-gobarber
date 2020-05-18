import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:providerId/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      providerId: Joi.string().uuid().required(),
    },
    [Segments.QUERY]: {
      month: Joi.number().min(1).max(12).required(),
      year: Joi.number().required(),
    },
  }),
  providerMonthAvailabilityController.index
);
providersRouter.get(
  '/:providerId/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      providerId: Joi.string().uuid().required(),
    },
    [Segments.QUERY]: {
      date: Joi.number().min(1).max(31).required(),
      month: Joi.number().min(1).max(12).required(),
      year: Joi.number().required(),
    },
  }),
  providerDayAvailabilityController.index
);

export default providersRouter;
