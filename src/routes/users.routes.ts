import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';
import CreateUserService from '../services/CreateUserService';
import User from '../models/Users';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateAvatarService from '../services/UpdateAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.get('/', async (request, response) => {
  const repository = getRepository(User);
  return response.json(await repository.find());
});

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const user = await new CreateUserService().execute({
    name,
    email,
    password,
  });
  delete user.password;
  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const { id } = request.user;
    const { filename, size } = request.file;
    const updateAvatar = new UpdateAvatarService();
    const user = await updateAvatar.execute({
      userId: id,
      avatarFilename: filename,
      avatarSize: size,
    });
    delete user.password;
    return response.json(user);
  }
);

export default usersRouter;
