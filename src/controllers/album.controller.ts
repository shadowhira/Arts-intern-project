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
  HttpErrors,
} from '@loopback/rest';
import {Album} from '../models';
import {AlbumRepository} from '../repositories';

export class AlbumController {
  constructor(
    @repository(AlbumRepository)
    public albumRepository: AlbumRepository,
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
    try {
      return this.albumRepository.create(album);
    } catch (error) {
      throw new HttpErrors.BadRequest('Tạo mới album thất bại,');
    }
  }

  @get('/albums/count')
  @response(200, {
    description: 'Album model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Album) where?: Where<Album>): Promise<Count> {
    try {
      return this.albumRepository.count(where);
    } catch (error) {
      throw new HttpErrors.InternalServerError('Lỗi khi đếm số album.');
    }
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
  async find(@param.filter(Album) filter?: Filter<Album>): Promise<Album[]> {
    try {
      return this.albumRepository.find(filter);
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        'Lỗi khi truy vấn danh sách album.',
      );
    }
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
    try {
      return this.albumRepository.updateAll(album, where);
    } catch (error) {
      throw new HttpErrors.BadRequest('Dữ liệu cập nhật không hợp lệ.');
    }
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
    @param.filter(Album, {exclude: 'where'})
    filter?: FilterExcludingWhere<Album>,
  ): Promise<Album> {
    try {
      const album = await this.albumRepository.findById(id, filter);
      if (!album) {
        throw new HttpErrors.NotFound('Không tìm thấy album.');
      }
      return album;
    } catch (error) {
      if (error instanceof HttpErrors.NotFound) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Lỗi khi tìm kiếm người dùng.');
    }
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
    try {
      await this.albumRepository.updateById(id, album);
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật album thất bại.');
    }
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
    try {
      await this.albumRepository.deleteById(id);
    } catch (error) {
      throw new HttpErrors.BadRequest('Xóa album thất bại.');
    }
  }
}
