import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Album,
  User,
} from '../models';
import {AlbumRepository} from '../repositories';

export class AlbumUserController {
  constructor(
    @repository(AlbumRepository)
    public albumRepository: AlbumRepository,
  ) { }

  @get('/albums/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Album',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Album.prototype.id,
  ): Promise<User> {
    return this.albumRepository.user(id);
  }
}
