import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Album,
} from '../models';
import {UserRepository} from '../repositories';

export class UserAlbumController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/albums', {
    responses: {
      '200': {
        description: 'Array of User has many Album',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Album)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Album>,
  ): Promise<Album[]> {
    return this.userRepository.albums(id).find(filter);
  }

  @post('/users/{id}/albums', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Album)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {
            title: 'NewAlbumInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) album: Omit<Album, 'id'>,
  ): Promise<Album> {
    return this.userRepository.albums(id).create(album);
  }

  @patch('/users/{id}/albums', {
    responses: {
      '200': {
        description: 'User.Album PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {partial: true}),
        },
      },
    })
    album: Partial<Album>,
    @param.query.object('where', getWhereSchemaFor(Album)) where?: Where<Album>,
  ): Promise<Count> {
    return this.userRepository.albums(id).patch(album, where);
  }

  @del('/users/{id}/albums', {
    responses: {
      '200': {
        description: 'User.Album DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Album)) where?: Where<Album>,
  ): Promise<Count> {
    return this.userRepository.albums(id).delete(where);
  }
}
