import {authenticate} from '@loopback/authentication';
import {inject, intercept} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Follow} from '../models';
import {FollowRepository, UserRepository} from '../repositories';
import {NotificationService} from '../services/notification.service';

export class FollowController {
  constructor(
    @repository(FollowRepository)
    public followRepository: FollowRepository,
    @inject('services.NotificationService')
    public notificationService: NotificationService,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  // @authenticate('jwt')
  // @intercept('admin')
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
      // Kiểm tra A không thể tự theo dõi chính mình
      if (follow.followerId === follow.followingId) {
        throw new HttpErrors.BadRequest('Đang follow chính mình.');
      }

      // Kiểm tra A đã theo dõi B chưa
      const existingFollow = await this.userRepository
        .followers(follow.followingId)
        .find({
          where: {
            id: follow.followerId,
          },
        });

      if (existingFollow.length > 0) {
        throw new HttpErrors.Conflict('Đã follow user này rồi.');
      }

      // Tạo follow
      const newFollow = await this.followRepository.create(follow);

      // Gọi notification service sau khi follow được tạo thành công
      await this.notificationService.notifyNewFollower(
        newFollow.followerId,
        newFollow.followingId,
      );

      return newFollow;
    } catch (error) {
      throw new HttpErrors.BadRequest(
        'Tạo mới follow thất bại: ' + error.message,
      );
    }
  }

  @authenticate('jwt')
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

  @authenticate('jwt')
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

  @authenticate('jwt')
  @intercept('admin')
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

  @authenticate('jwt')
  @intercept('user')
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

  @authenticate('jwt')
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

  @authenticate('jwt')
  @intercept('admin')
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

  @authenticate('jwt')
  @intercept('admin')
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
