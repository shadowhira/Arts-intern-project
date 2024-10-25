import { repository } from '@loopback/repository';
import { NotificationRepository, UserRepository } from '../repositories';

export class NotificationService {
    constructor(
      @repository(UserRepository) private userRepository: UserRepository,
      @repository(NotificationRepository) private notificationRepo: NotificationRepository,
    ) {}
  
    async notifyFollowers(userId: string, type: 'album' | 'image'): Promise<void> {
      const followers = await this.userRepository.find({
        where: {followingId: userId},
      });
  
      const notifications = followers.map(follower => ({
        userId: follower.id,
        message: `${userId} đã tạo ${type} mới!`,
      }));
  
      await this.notificationRepo.createAll(notifications);
    }
  }
