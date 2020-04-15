import { Router } from 'express';

import { getRepository } from 'typeorm';
import CreateUserService from '../services/CreateUserService';
import User from '../models/Users';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const repository = getRepository(User);
  return response.json(await repository.find());
});

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const user = await new CreateUserService().execute({
      name,
      email,
      password,
    });
    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;
