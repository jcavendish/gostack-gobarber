import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentsRepository);
  return response.json(await repository.find());
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider, date } = request.body;
    const parsedDate = parseISO(date);
    const appointment = await new CreateAppointmentService().execute({
      provider,
      date: parsedDate,
    });
    return response.json(appointment);
  } catch (err) {
    console.log(err);
    return response.status(400).json({ error: err.message });
  }
});

export default appointmentsRouter;
