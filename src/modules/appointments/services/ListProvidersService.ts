import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../../users/infra/typeorm/entities/User';

interface IRequest {
  userId: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ userId }: IRequest): Promise<User[]> {
    return this.usersRepository.findAllProvidersExcept({
      exceptedProviderId: userId,
    });
  }
}

export default ListProvidersService;
