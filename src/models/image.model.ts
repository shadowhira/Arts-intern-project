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
  width: number; // Thêm thuộc tính width

  @property({
    type: 'number',
    required: true,
  })
  height: number; // Thêm thuộc tính height

  @belongsTo(() => Album)
  albumId: string;

  @belongsTo(() => User)
  userId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Image>) {
    super(data);
  }
}

export interface ImageRelations {
  // describe navigational properties here
}

export type ImageWithRelations = Image & ImageRelations;