import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {ArtsApiDataSource} from '../datasources';
import {Notification, NotificationRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class NotificationRepository extends DefaultCrudRepository<
  Notification,
  typeof Notification.prototype.id,
  NotificationRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Notification.prototype.id>;

  constructor(
    @inject('datasources.artsAPI') dataSource: ArtsApiDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Notification, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
