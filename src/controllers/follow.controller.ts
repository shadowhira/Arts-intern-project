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
import {Follow} from '../models';
import {FollowRepository} from '../repositories';

export class FollowController {
  constructor(
    @repository(FollowRepository)
    public followRepository: FollowRepository,
  ) {}

  @post('/follows')
  @response(200, {
    description: 'Follow model instance',
    content: {'application/json': {schema: getModelSchemaRef(Follow)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Follow, {
            title: 'NewFollow',
            exclude: ['id'],
          }),
        },
      },
    })
    follow: Omit<Follow, 'id'>,
  ): Promise<Follow> {
    try {
      return this.followRepository.create(follow);
    } catch (error) {
      throw new HttpErrors.BadRequest('Tạo mới follow thất bại.');
    }
  }

  @get('/follows/count')
  @response(200, {
    description: 'Follow model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Follow) where?: Where<Follow>): Promise<Count> {
    try {
      return this.followRepository.count(where);
    } catch (error) {
      throw new HttpErrors.BadRequest('Đếm follow thất bại.');
    }
  }

  @get('/follows')
  @response(200, {
    description: 'Array of Follow model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Follow, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Follow) filter?: Filter<Follow>): Promise<Follow[]> {
    try {
      return this.followRepository.find(filter);
    } catch (error) {
      throw new HttpErrors.BadRequest('Lấy follow thất bại.');
    }
  }

  @patch('/follows')
  @response(200, {
    description: 'Follow PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Follow, {partial: true}),
        },
      },
    })
    follow: Follow,
    @param.where(Follow) where?: Where<Follow>,
  ): Promise<Count> {
    try {
      return this.followRepository.updateAll(follow, where);
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật follow thất bại.');
    }
  }

  @get('/follows/{id}')
  @response(200, {
    description: 'Follow model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Follow, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Follow, {exclude: 'where'})
    filter?: FilterExcludingWhere<Follow>,
  ): Promise<Follow> {
    try {
      return this.followRepository.findById(id, filter);
    } catch (error) {
      throw new HttpErrors.BadRequest('Lấy follow thất bại.');
    }
  }

  @patch('/follows/{id}')
  @response(204, {
    description: 'Follow PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Follow, {partial: true}),
        },
      },
    })
    follow: Follow,
  ): Promise<void> {
    try {
      await this.followRepository.updateById(id, follow);
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật follow thất bại.');
    }
  }

  @put('/follows/{id}')
  @response(204, {
    description: 'Follow PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() follow: Follow,
  ): Promise<void> {
    try {
      await this.followRepository.replaceById(id, follow);
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật follow thất bại.');
    }
  }

  @del('/follows/{id}')
  @response(204, {
    description: 'Follow DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    try {
      await this.followRepository.deleteById(id);
    } catch (error) {
      throw new HttpErrors.BadRequest('Xóa follow thất bại.');
    }
  }
}
