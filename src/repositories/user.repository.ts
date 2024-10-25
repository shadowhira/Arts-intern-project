import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {ArtsApiDataSource} from '../datasources';
import {User, UserRelations, Album, Notification, Follow} from '../models';
import {AlbumRepository} from './album.repository';
import {NotificationRepository} from './notification.repository';
import {FollowRepository} from './follow.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly albums: HasManyRepositoryFactory<Album, typeof User.prototype.id>;

  public readonly notifications: HasManyRepositoryFactory<Notification, typeof User.prototype.id>;

  public readonly followings: HasManyThroughRepositoryFactory<User, typeof User.prototype.id,
          Follow,
          typeof User.prototype.id
        >;

  public readonly followers: HasManyThroughRepositoryFactory<User, typeof User.prototype.id,
          Follow,
          typeof User.prototype.id
        >;

  constructor(
    @inject('datasources.artsAPI') dataSource: ArtsApiDataSource, @repository.getter('AlbumRepository') protected albumRepositoryGetter: Getter<AlbumRepository>, @repository.getter('NotificationRepository') protected notificationRepositoryGetter: Getter<NotificationRepository>, @repository.getter('FollowRepository') protected followRepositoryGetter: Getter<FollowRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(User, dataSource);
    this.followers = this.createHasManyThroughRepositoryFactoryFor('followers', userRepositoryGetter, followRepositoryGetter,);
    this.registerInclusionResolver('followers', this.followers.inclusionResolver);
    this.followings = this.createHasManyThroughRepositoryFactoryFor('followings', userRepositoryGetter, followRepositoryGetter,);
    this.registerInclusionResolver('followings', this.followings.inclusionResolver);
    this.notifications = this.createHasManyRepositoryFactoryFor('notifications', notificationRepositoryGetter,);
    this.registerInclusionResolver('notifications', this.notifications.inclusionResolver);
    this.albums = this.createHasManyRepositoryFactoryFor('albums', albumRepositoryGetter,);
    this.registerInclusionResolver('albums', this.albums.inclusionResolver);
  }
}
