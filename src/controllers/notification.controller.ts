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
import {Notification} from '../models';
import {NotificationRepository} from '../repositories';
import {intercept} from '@loopback/core';
import {authenticate} from '@loopback/authentication';

export class NotificationController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
  ) {}

  @authenticate('jwt')
  @intercept('admin')
  @post('/notifications')
  @response(200, {
    description: 'Notification model instance',
    content: {'application/json': {schema: getModelSchemaRef(Notification)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {
            title: 'NewNotification',
            exclude: ['id'],
          }),
        },
      },
    })
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    try {
      return this.notificationRepository.create(notification);
    } catch (error) {
      throw new HttpErrors.BadRequest('Tạo mới thông báo thất bại.');
    }
  }

  @authenticate('jwt')
  @intercept('admin')
  @get('/notifications/count')
  @response(200, {
    description: 'Notification model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Notification) where?: Where<Notification>,
  ): Promise<Count> {
    try {
      return this.notificationRepository.count(where);
    } catch (error) {
      throw new HttpErrors.BadRequest('Lấy số lượng thông báo thất bại.');
    }
  }

  @authenticate('jwt')
  @get('/notifications')
  @response(200, {
    description: 'Array of Notification model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Notification, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Notification) filter?: Filter<Notification>,
    @param.query.string('userId') userId?: string,
  ): Promise<Notification[]> {
    try {
      if (userId) {
        filter = filter ?? {};
        filter.where = {
          ...filter.where,
          receiverId: userId, 
        };
      }
  
      return this.notificationRepository.find(filter);
    } catch (error) {
      throw new HttpErrors.BadRequest('Lấy thông báo thất bại.');
    }
  }  

  @authenticate('jwt')
  @intercept('admin')
  @patch('/notifications')
  @response(200, {
    description: 'Notification PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
      },
    })
    notification: Notification,
    @param.where(Notification) where?: Where<Notification>,
  ): Promise<Count> {
    try {
      return this.notificationRepository.updateAll(notification, where);
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật thông báo thất bại.');
    }
  }

  @authenticate('jwt')
  @get('/notifications/{id}')
  @response(200, {
    description: 'Notification model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Notification, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Notification, {exclude: 'where'})
    filter?: FilterExcludingWhere<Notification>,
  ): Promise<Notification> {
    try {
      return this.notificationRepository.findById(id, filter);
    } catch (error) {
      throw new HttpErrors.NotFound('Không tìm thấy thông báo.');
    }
  }

  @authenticate('jwt')
  @intercept('admin')
  @patch('/notifications/{id}')
  @response(204, {
    description: 'Notification PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
      },
    })
    notification: Notification,
  ): Promise<void> {
    try {
      await this.notificationRepository.updateById(id, notification);
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật thông báo thất bại.');
    }
  }

  @authenticate('jwt')
  @intercept('admin')
  @put('/notifications/{id}')
  @response(204, {
    description: 'Notification PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() notification: Notification,
  ): Promise<void> {
    try {
      await this.notificationRepository.replaceById(id, notification);
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật thông báo thất bại.');
    }
  }

  @authenticate('jwt')
  @intercept('user')
  @del('/notifications/{id}')
  @response(204, {
    description: 'Notification DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    try {
      await this.notificationRepository.deleteById(id);
    } catch (error) {
      throw new HttpErrors.BadRequest('Xóa thông báo thất bại.');
    }
  }

  // API để lấy thông báo chưa đọc của người dùng
  @authenticate('jwt')
  @get('/notifications/unread/{userId}')
  @response(200, {
    description: 'Array of unread Notification model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Notification, {includeRelations: true}),
        },
      },
    },
  })
  async findUnread(
    @param.path.string('userId') userId: string,
  ): Promise<Notification[]> {
    try {
      const filter: Filter<Notification> = {
        where: {
          receiverId: userId,
          seen: false,
        },
      };
      return this.notificationRepository.find(filter);
    } catch (error) {
      throw new HttpErrors.BadRequest('Lấy thông báo chưa đọc thất bại.');
    }
  }

  // API để đánh dấu thông báo là đã đọc
  @authenticate('jwt')
  @patch('/notifications/mark-as-read/{id}')
  @response(204, {
    description: 'Notification marked as read',
  })
  async markAsRead(
    @param.path.string('id') id: string,
  ): Promise<void> {
    try {
      await this.notificationRepository.updateById(id, {seen: true});
    } catch (error) {
      throw new HttpErrors.BadRequest('Đánh dấu thông báo đã đọc thất bại.');
    }
  }
}