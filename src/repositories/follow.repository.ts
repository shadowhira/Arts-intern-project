import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ArtsApiDataSource} from '../datasources';
import {Follow, FollowRelations} from '../models';

export class FollowRepository extends DefaultCrudRepository<
  Follow,
  typeof Follow.prototype.id,
  FollowRelations
> {
  constructor(
    @inject('datasources.artsAPI') dataSource: ArtsApiDataSource,
  ) {
    super(Follow, dataSource);
  }
}
