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
  RestBindings,
  Request,
} from '@loopback/rest';
import {Image} from '../models';
import {ImageRepository} from '../repositories';
import {intercept, inject} from '@loopback/core';
import {authenticate, UserService} from '@loopback/authentication';
import {NotificationService} from '../services/notification.service';
import multer from 'multer';
import cloudinary from '../config/cloudinary.config';
import {Readable} from 'stream';

export class ImageController {
  constructor(
    @repository(ImageRepository) public imageRepository: ImageRepository,
    @inject('services.NotificationService')
    public notificationService: NotificationService,
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
          schema: {
            type: 'object',
            properties: {
              file: {type: 'string', format: 'binary'},
              title: {type: 'string'},
              star: {type: 'number'},
              albumId: {type: 'string'},
              userId: {type: 'string'},
              public: {type: 'boolean'},
              width: {type: 'number'},
              height: {type: 'number'},
            },
            required: [
              'file',
              'title',
              'star',
              'albumId',
              'userId',
              'public',
              'width',
              'height',
            ],
          },
        },
      },
    })
    requestData: {
      file: string;
      title: string;
      star: number;
      albumId: string;
      userId: string;
      public: boolean;
      width: number;
      height: number;
    },
  ): Promise<Image> {
    const {
      file,
      title,
      star,
      albumId,
      userId,
      public: isPublic,
      width,
      height,
    } = requestData;

    try {
      const bufferStream = new Readable();
      bufferStream.push(Buffer.from(file, 'base64'));
      bufferStream.push(null);

      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        bufferStream.pipe(stream);
      });

      const newImage = await this.imageRepository.create({
        title,
        url: result.secure_url,
        star,
        albumId, 
        userId,
        public: isPublic, 
        width,
        height, 
        status: 'pending', // Đặt trạng thái ban đầu là pending
      });

      await this.notificationService.notifyFollowersCreateNew(
        newImage.userId,
        'image',
      );

      return newImage;
    } catch (error) {
      throw new HttpErrors.BadRequest(
        'Failed to create image: ' + error.message,
      );
    }
  }

  @authenticate('jwt')
  @intercept('author')
  @patch('/images/{id}/approve')
  @response(204, {
    description: 'Image approved successfully',
  })
  async approveImage(
    @param.path.string('id') id: string,
  ): Promise<void> {
    try {
      // check status
      const image = await this.imageRepository.findById(id);
      if (image.status !== 'pending') {
        throw new HttpErrors.BadRequest('Ảnh đã được phê duyệt hoặc từ chối.');
      }
      await this.imageRepository.updateById(id, {status: 'approved'});
      await this.notificationService.notifyImageApproved(image.userId, id);
      return Promise.resolve();
    } catch (error) {
      throw new HttpErrors.BadRequest('Ảnh đã được phê duyệt hoặc từ chối.');
    }
  }

  @authenticate('jwt')
  @intercept('author')
  @patch('/images/{id}/reject')
  @response(204, {
    description: 'Image rejected successfully',
  })
  async rejectImage(
    @param.path.string('id') id: string,
  ): Promise<void> {
    try {
      const image = await this.imageRepository.findById(id);
      if (image.status !== 'pending') {
        throw new HttpErrors.BadRequest('Ảnh đã được phê duyệt hoặc từ chối.');
      }
      await this.imageRepository.updateById(id, {status: 'rejected'});
      await this.notificationService.notifyImageRejected(image.userId, id);
      return Promise.resolve();
    } catch (error) {
      throw new HttpErrors.BadRequest('Ảnh đã được phê duyệt hoặc từ chối.');
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
  async find(
    @param.filter(Image) filter?: Filter<Image>,
    @param.query.string('title') title?: string,
    @param.query.boolean('publicOnly') publicOnly?: boolean,
    @param.query.string('userId') userId?: string,
    @param.query.string('albumId') albumId?: string,
    @param.query.string('status') status?: string,
  ): Promise<Image[]> {
    try {
      const whereFilter: any = {};
  
      if (publicOnly) {
        whereFilter.public = true;
      }
  
      if (title) {
        whereFilter.title = {like: title, options: 'i'};
      }

      if (userId) {
        whereFilter.userId = userId;
      }

      if (albumId) {
        whereFilter.albumId = albumId;
      }

      if (status) {
        whereFilter.status = status;
      }
  
      const finalFilter = {
        ...filter,
        where: {...whereFilter, ...(filter?.where || {})},
        include: [{relation: 'user'}, {relation: 'album'}],
      };
  
      return this.imageRepository.find(finalFilter);
    } catch (error) {
      throw new HttpErrors.InternalServerError('Tìm hình ảnh thất bại.');
    }
  }  

  @authenticate('jwt')
  @intercept('admin')
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

  @authenticate('jwt')
  @intercept('user')
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

  @authenticate('jwt')
  @intercept('user')
  @patch('/images/{id}')
  @response(200, {
    description: 'Image PATCH success',
    content: {'application/json': {schema: getModelSchemaRef(Image)}},
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
  ): Promise<Image> {
    try {
      await this.imageRepository.updateById(id, image);
      const updatedImage = await this.imageRepository.findById(id);
      return updatedImage;
    } catch (error) {
      throw new HttpErrors.BadRequest('Cập nhật ảnh thất bại.');
    }
  }

  @authenticate('jwt')
  @intercept('user')
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

  @authenticate('jwt')
  @intercept('user')
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