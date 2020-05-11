import { Response, Request } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;

    const showProfile = container.resolve(ShowProfileService);
    const user = await showProfile.execute(userId);

    delete user.password;

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { name, email, oldPassword, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);
    const user = await updateProfile.execute({
      userId,
      name,
      email,
      oldPassword,
      password,
    });

    delete user.password;

    return response.json(user);
  }
}

export default ProfileController;
