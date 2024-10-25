import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {ArtsApiDataSource} from '../datasources';
import {Album, AlbumRelations, User, Image} from '../models';
import {UserRepository} from './user.repository';
import {ImageRepository} from './image.repository';

export class AlbumRepository extends DefaultCrudRepository<
  Album,
  typeof Album.prototype.id,
  AlbumRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Album.prototype.id>;

  public readonly images: HasManyRepositoryFactory<Image, typeof Album.prototype.id>;

  constructor(
    @inject('datasources.artsAPI') dataSource: ArtsApiDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ImageRepository') protected imageRepositoryGetter: Getter<ImageRepository>,
  ) {
    super(Album, dataSource);
    this.images = this.createHasManyRepositoryFactoryFor('images', imageRepositoryGetter,);
    this.registerInclusionResolver('images', this.images.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
