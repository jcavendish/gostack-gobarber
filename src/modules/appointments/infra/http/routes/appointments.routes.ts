import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);
/*
appointmentsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentsRepository);
  return response.json(await repository.find());
}); */

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
