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
import {User} from '../models';
import {UserRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate('jwt')
  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {email: user.email},
    });
    if (existingUser) {
      throw new HttpErrors.Conflict(
        'Email đã được sử dụng bởi một người dùng khác.',
      );
    }

    try {
      return await this.userRepository.create(user);
    } catch (error) {
      // Xử lý lỗi khi tạo người dùng, ví dụ như lỗi xác thực dữ liệu
      throw new HttpErrors.BadRequest('Dữ liệu người dùng không hợp lệ.');
    }
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    try {
      return await this.userRepository.count(where);
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        'Lỗi khi đếm số lượng người dùng.',
      );
    }
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    try {
      return await this.userRepository.find(filter);
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        'Lỗi khi truy vấn danh sách người dùng.',
      );
    }
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    try {
      return await this.userRepository.updateAll(user, where);
    } catch (error) {
      throw new HttpErrors.BadRequest('Dữ liệu cập nhật không hợp lệ.');
    }
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findById(id, filter);
      if (!user) {
        throw new HttpErrors.NotFound(
          `Không tìm thấy người dùng với id: ${id}`,
        );
      }
      return user;
    } catch (error) {
      if (error instanceof HttpErrors.NotFound) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Lỗi khi tìm kiếm người dùng.');
    }
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    const existingUser = await this.userRepository
      .findById(id)
      .catch(() => null);
    if (!existingUser) {
      throw new HttpErrors.NotFound(`Không tìm thấy người dùng với id: ${id}`);
    }

    try {
      await this.userRepository.updateById(id, user);
    } catch (error) {
      throw new HttpErrors.BadRequest('Dữ liệu cập nhật không hợp lệ.');
    }
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    const existingUser = await this.userRepository
      .findById(id)
      .catch(() => null);
    if (!existingUser) {
      throw new HttpErrors.NotFound(`Không tìm thấy người dùng với id: ${id}`);
    }

    try {
      await this.userRepository.replaceById(id, user);
    } catch (error) {
      throw new HttpErrors.BadRequest('Dữ liệu thay thế không hợp lệ.');
    }
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const existingUser = await this.userRepository
      .findById(id)
      .catch(() => null);
    if (!existingUser) {
      throw new HttpErrors.NotFound(`Không tìm thấy người dùng với id: ${id}`);
    }

    try {
      await this.userRepository.deleteById(id);
    } catch (error) {
      throw new HttpErrors.InternalServerError('Lỗi khi xóa người dùng.');
    }
  }
}
