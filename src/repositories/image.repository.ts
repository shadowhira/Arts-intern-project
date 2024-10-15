import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ArtsApiDataSource} from '../datasources';
import {Image, ImageRelations} from '../models';

export class ImageRepository extends DefaultCrudRepository<
  Image,
  typeof Image.prototype.id,
  ImageRelations
> {
  constructor(
    @inject('datasources.artsAPI') dataSource: ArtsApiDataSource,
  ) {
    super(Image, dataSource);
  }
}
