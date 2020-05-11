import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/middlewares/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const routes = Router();
const profileController = new ProfileController();

routes.use(ensureAuthenticated);

routes.get('/', profileController.show);
routes.put('/', profileController.update);

export default routes;
