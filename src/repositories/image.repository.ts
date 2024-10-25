import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {ArtsApiDataSource} from '../datasources';
import {Image, ImageRelations, Album} from '../models';
import {AlbumRepository} from './album.repository';

export class ImageRepository extends DefaultCrudRepository<
  Image,
  typeof Image.prototype.id,
  ImageRelations
> {

  public readonly album: BelongsToAccessor<Album, typeof Image.prototype.id>;

  constructor(
    @inject('datasources.artsAPI') dataSource: ArtsApiDataSource, @repository.getter('AlbumRepository') protected albumRepositoryGetter: Getter<AlbumRepository>,
  ) {
    super(Image, dataSource);
    this.album = this.createBelongsToAccessorFor('album', albumRepositoryGetter,);
    this.registerInclusionResolver('album', this.album.inclusionResolver);
  }
}
