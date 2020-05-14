import 'reflect-metadata';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import FakeAppointmentsRepository from '../repositories/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let appointmentsRepository: IAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListAppointmentsProvider', () => {
  beforeEach(async () => {
    appointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      appointmentsRepository
    );
  });

  it('should be able to list the appointments of the signed in provider', async () => {
    const appointment1 = await appointmentsRepository.create({
      providerId: 'test-provider-1',
      date: new Date(2020, 4, 12, 9),
      userId: 'test-user-1',
    });

    const appointment2 = await appointmentsRepository.create({
      providerId: 'test-provider-1',
      date: new Date(2020, 4, 12, 10),
      userId: 'test-user-1',
    });

    const appointments = await listProviderAppointments.execute({
      providerId: 'test-provider-1',
      date: 12,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
