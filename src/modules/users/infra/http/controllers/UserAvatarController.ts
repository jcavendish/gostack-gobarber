import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';

class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { filename, size } = request.file;
    const updateAvatar = container.resolve(UpdateAvatarService);
    const user = await updateAvatar.execute({
      userId: id,
      avatarFilename: filename,
      avatarSize: size,
    });
    delete user.password;
    return response.json(user);
  }
}

export default UserAvatarController;
