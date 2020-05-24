import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentsDTO from '../dtos/ICreateAppoinmentsDTO';
import IFindAllInMonthByProviderDTO from '../dtos/IFindAllInMonthByProviderDTO';
import IFindAllInDateByProviderDTO from '../dtos/IFindAllInDateByProviderDTO';

export default interface IAppointmentsRepository {
  create(appointment: ICreateAppointmentsDTO): Promise<Appointment>;
  findByDate(providerId: string, date: Date): Promise<Appointment | undefined>;
  findAllInMonthByProvider({
    providerId,
    month,
    year,
  }: IFindAllInMonthByProviderDTO): Promise<Appointment[]>;
  findAllInDateByProvider({
    providerId,
    date,
    month,
    year,
  }: IFindAllInDateByProviderDTO): Promise<Appointment[]>;
}
