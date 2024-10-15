import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ArtsApiDataSource} from '../datasources';
import {Album, AlbumRelations} from '../models';

export class AlbumRepository extends DefaultCrudRepository<
  Album,
  typeof Album.prototype.id,
  AlbumRelations
> {
  constructor(
    @inject('datasources.artsAPI') dataSource: ArtsApiDataSource,
  ) {
    super(Album, dataSource);
  }
}
