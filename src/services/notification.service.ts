import { repository } from '@loopback/repository';
import { NotificationRepository, FollowRepository, UserRepository } from '../repositories';

export class NotificationService {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @repository(NotificationRepository) private notificationRepo: NotificationRepository,
    @repository(FollowRepository) private followRepository: FollowRepository,
  ) {}

  async notifyFollowersCreateNew(userId: string, type: 'album' | 'image'): Promise<void> {
    // Tìm tất cả người đang follow userId
    const followers = await this.followRepository.find({
      where: { followerId: userId },
    });

    const user = await this.userRepository.findById(userId);

    // Tạo thông báo cho từng follower
    const notifications = followers.map(follow => ({
      senderId: userId,
      receiverId: follow.followerId,
      message: `${user.username} đã tạo ${type} mới!`,
      actionType: type,
    }));

    // Lưu tất cả thông báo vào repository
    await this.notificationRepo.createAll(notifications);
  }

  async notifyNewFollower(followerUserId: string, followingUserId: string): Promise<void> {
    const user = await this.userRepository.findById(followerUserId);

    const notification = {
      senderId: followerUserId,
      receiverId: followingUserId,
      message: `User ${user.username} đã theo dõi bạn.`,
      actionType: 'follow' as 'follow',
    };

    await this.notificationRepo.create(notification);
  }
}
