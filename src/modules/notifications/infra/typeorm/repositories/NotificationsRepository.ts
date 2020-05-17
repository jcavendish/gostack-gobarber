import { MongoRepository, getMongoRepository } from 'typeorm';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private typeOrmRepository: MongoRepository<Notification>;

  constructor() {
    this.typeOrmRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipientId,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.typeOrmRepository.create({
      content,
      recipientId,
    });
    return this.typeOrmRepository.save(notification);
  }
}

export default NotificationsRepository;
