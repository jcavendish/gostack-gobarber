import User from '../infra/typeorm/entities/User';
import ICreateUsersDTO from '../dtos/ICreateUsersDTO';
import IListProviderDTO from '../dtos/IListProviderDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(user: ICreateUsersDTO): Promise<User>;
  update(user: User): Promise<User>;
  findAllProvidersExcept(exceptedProvider: IListProviderDTO): Promise<User[]>;
}
