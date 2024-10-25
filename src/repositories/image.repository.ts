import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {ArtsApiDataSource} from '../datasources';
import {Image, ImageRelations, Album, User} from '../models';
import {AlbumRepository} from './album.repository';
import {UserRepository} from './user.repository';

export class ImageRepository extends DefaultCrudRepository<
  Image,
  typeof Image.prototype.id,
  ImageRelations
> {

  public readonly album: BelongsToAccessor<Album, typeof Image.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Image.prototype.id>;

  constructor(
    @inject('datasources.artsAPI') dataSource: ArtsApiDataSource, @repository.getter('AlbumRepository') protected albumRepositoryGetter: Getter<AlbumRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Image, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.album = this.createBelongsToAccessorFor('album', albumRepositoryGetter,);
    this.registerInclusionResolver('album', this.album.inclusionResolver);
  }
}
