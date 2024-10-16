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
import {Image} from '../models';
import {ImageRepository} from '../repositories';

export class ImageController {
  constructor(
    @repository(ImageRepository)
    public imageRepository: ImageRepository,
  ) {}

  @post('/images')
  @response(200, {
    description: 'Image model instance',
    content: {'application/json': {schema: getModelSchemaRef(Image)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Image, {
            title: 'NewImage',
            exclude: ['id'],
          }),
        },
      },
    })
    image: Omit<Image, 'id'>,
  ): Promise<Image> {
    try {
      return this.imageRepository.create(image);
    } catch (error) {
      throw new HttpErrors.BadRequest('Tạo mới ảnh thất bại.');
    }
  }

  @get('/images/count')
  @response(200, {
    description: 'Image model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Image) where?: Where<Image>): Promise<Count> {
    try {
      return this.imageRepository.count(where);
    } catch (error) {
      throw new HttpErrors.BadRequest('Lấy số lượng ảnh thất bại.');
    }
  }

  @get('/images')
  @response(200, {
    description: 'Array of Image model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Image, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Image) filter?: Filter<Image>): Promise<Image[]> {
    try {
      return await this.imageRepository.find(filter);
    } catch (error) {
      throw new HttpErrors.InternalServerError('Tìm hình ảnh thất bại.');
    }
  }

  @patch('/images')
  @response(200, {
    description: 'Image PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Image, {partial: true}),
        },
      },
    })
    image: Image,
    @param.where(Image) where?: Where<Image>,
  ): Promise<Count> {
    try {
      return this.imageRepository.updateAll(image, where);
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật ảnh thất bại');
    }
  }

  @get('/images/{id}')
  @response(200, {
    description: 'Image model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Image, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Image, {exclude: 'where'})
    filter?: FilterExcludingWhere<Image>,
  ): Promise<Image> {
    try {
      const image = await this.imageRepository.findById(id, filter);
      if (!image) {
        throw new HttpErrors.NotFound('Không tìm thấy ảnh.');
      }
      return image;
    } catch (error) {
      throw new HttpErrors.BadRequest('Lấy thông tin ảnh thất bại.');
    }
  }

  @patch('/images/{id}')
  @response(204, {
    description: 'Image PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Image, {partial: true}),
        },
      },
    })
    image: Image,
  ): Promise<void> {
    try {
      await this.imageRepository.updateById(id, image);
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật ảnh thất bại.');
    }
  }

  @put('/images/{id}')
  @response(204, {
    description: 'Image PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() image: Image,
  ): Promise<void> {
    try {
      await this.imageRepository.replaceById(id, image);
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật ảnh thất bại.');
    }
  }

  @del('/images/{id}')
  @response(204, {
    description: 'Image DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    try {
      await this.imageRepository.deleteById(id);
    } catch (error) {
      throw new HttpErrors.BadRequest('Xóa ảnh thất bại.');
    }
  }
}
