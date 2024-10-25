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
  Album,
} from '../models';
import {ImageRepository} from '../repositories';

export class ImageAlbumController {
  constructor(
    @repository(ImageRepository)
    public imageRepository: ImageRepository,
  ) { }

  @get('/images/{id}/album', {
    responses: {
      '200': {
        description: 'Album belonging to Image',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Album),
          },
        },
      },
    },
  })
  async getAlbum(
    @param.path.string('id') id: typeof Image.prototype.id,
  ): Promise<Album> {
    return this.imageRepository.album(id);
  }
}
