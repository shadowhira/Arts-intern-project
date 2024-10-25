import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
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
}
