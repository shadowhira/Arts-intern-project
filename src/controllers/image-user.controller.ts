import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  HttpErrors,
} from '@loopback/rest';
import {
  Image,
  User,
} from '../models';
import {ImageRepository} from '../repositories';

export class ImageUserController {
  constructor(
    @repository(ImageRepository)
    public imageRepository: ImageRepository,
  ) { }

  @get('/images/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Image',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Image.prototype.id,
  ): Promise<User> {
    return this.imageRepository.user(id);
  }

  @get('/images/{id}/username', {
    responses: {
      '200': {
        description: 'Get user name from image',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async getUserNameFromImage(
    @param.path.string('id') id: typeof Image.prototype.id,
  ): Promise<{name: string}> {
    const user = await this.imageRepository.user(id);
    if (!user) {
      throw new HttpErrors.NotFound('Không tìm thấy người dùng.');
    }
    return {name: user.username};
  }
}