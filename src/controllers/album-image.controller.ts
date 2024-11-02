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
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Album,
  Image,
} from '../models';
import {AlbumRepository} from '../repositories';

export class AlbumImageController {
  constructor(
    @repository(AlbumRepository) protected albumRepository: AlbumRepository,
  ) { }

  @get('/albums/{id}/images', {
    responses: {
      '200': {
        description: 'Array of Album has many Image',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Image)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Image>,
    @param.query.boolean('publicOnly') publicOnly?: boolean, 
  ): Promise<Image[]> {
    try {
      const whereFilter: any = {};

      if (publicOnly) {
        whereFilter.public = true;
      }

      const finalFilter = {
        ...filter,
        where: {...whereFilter, ...(filter?.where || {})},
        include: [{relation: 'user'}], 
      };

      return this.albumRepository.images(id).find(finalFilter);
    } catch (error) {
      throw new HttpErrors.InternalServerError('Tìm hình ảnh thất bại.');
    }
  }

  @post('/albums/{id}/images', {
    responses: {
      '200': {
        description: 'Album model instance',
        content: {'application/json': {schema: getModelSchemaRef(Image)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Album.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Image, {
            title: 'NewImageInAlbum',
            exclude: ['id'],
            optional: ['albumId']
          }),
        },
      },
    }) image: Omit<Image, 'id'>,
  ): Promise<Image> {
    return this.albumRepository.images(id).create(image);
  }

  @patch('/albums/{id}/images', {
    responses: {
      '200': {
        description: 'Album.Image PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Image, {partial: true}),
        },
      },
    })
    image: Partial<Image>,
    @param.query.object('where', getWhereSchemaFor(Image)) where?: Where<Image>,
  ): Promise<Count> {
    return this.albumRepository.images(id).patch(image, where);
  }

  @del('/albums/{id}/images', {
    responses: {
      '200': {
        description: 'Album.Image DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Image)) where?: Where<Image>,
  ): Promise<Count> {
    return this.albumRepository.images(id).delete(where);
  }
}
