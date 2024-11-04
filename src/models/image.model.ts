import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Album} from './album.model';
import {User} from './user.model';

@model({settings: {strict: false}}) 
export class Image extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'number',
    required: true,
  })
  star: number;

  @property({
    type: 'boolean',
    required: true,
  })
  public: boolean;

  @property({
    type: 'number',
    required: true,
  })
  width: number;

  @property({
    type: 'number',
    required: true,
  })
  height: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['pending', 'approved', 'rejected'],
    },
  })
  status: string; // Thêm thuộc tính status

  @belongsTo(() => Album)
  albumId: string;

  @belongsTo(() => User)
  userId: string;

  [prop: string]: any;

  constructor(data?: Partial<Image>) {
    super(data);
  }
}

export interface ImageRelations {
  // describe navigational properties here
}

export type ImageWithRelations = Image & ImageRelations;