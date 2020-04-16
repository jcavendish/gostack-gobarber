import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentsRepository);
  return response.json(await repository.find());
});

appointmentsRouter.post('/', async (request, response) => {
  const { providerId, date } = request.body;
  const parsedDate = parseISO(date);
  const appointment = await new CreateAppointmentService().execute({
    providerId,
    date: parsedDate,
  });
  return response.json(appointment);
});

export default appointmentsRouter;
