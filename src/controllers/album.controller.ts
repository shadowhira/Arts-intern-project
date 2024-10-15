import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Album} from '../models';
import {AlbumRepository} from '../repositories';

export class AlbumController {
  constructor(
    @repository(AlbumRepository)
    public albumRepository : AlbumRepository,
  ) {}

  @post('/albums')
  @response(200, {
    description: 'Album model instance',
    content: {'application/json': {schema: getModelSchemaRef(Album)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {
            title: 'NewAlbum',
            exclude: ['id'],
          }),
        },
      },
    })
    album: Omit<Album, 'id'>,
  ): Promise<Album> {
    return this.albumRepository.create(album);
  }

  @get('/albums/count')
  @response(200, {
    description: 'Album model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Album) where?: Where<Album>,
  ): Promise<Count> {
    return this.albumRepository.count(where);
  }

  @get('/albums')
  @response(200, {
    description: 'Array of Album model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Album, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Album) filter?: Filter<Album>,
  ): Promise<Album[]> {
    return this.albumRepository.find(filter);
  }

  @patch('/albums')
  @response(200, {
    description: 'Album PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {partial: true}),
        },
      },
    })
    album: Album,
    @param.where(Album) where?: Where<Album>,
  ): Promise<Count> {
    return this.albumRepository.updateAll(album, where);
  }

  @get('/albums/{id}')
  @response(200, {
    description: 'Album model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Album, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Album, {exclude: 'where'}) filter?: FilterExcludingWhere<Album>
  ): Promise<Album> {
    return this.albumRepository.findById(id, filter);
  }

  @patch('/albums/{id}')
  @response(204, {
    description: 'Album PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {partial: true}),
        },
      },
    })
    album: Album,
  ): Promise<void> {
    await this.albumRepository.updateById(id, album);
  }

  @put('/albums/{id}')
  @response(204, {
    description: 'Album PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() album: Album,
  ): Promise<void> {
    await this.albumRepository.replaceById(id, album);
  }

  @del('/albums/{id}')
  @response(204, {
    description: 'Album DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.albumRepository.deleteById(id);
  }
}
