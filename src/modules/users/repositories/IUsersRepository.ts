import User from '../infra/typeorm/entities/Users';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  update(user: User): Promise<User>;
}
