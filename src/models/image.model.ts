import {Entity, model, property} from '@loopback/repository';

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
    jsonSchema: {
      minLength: 3,
      maxLength: 50,
    },
  })
  title: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'uri',
    },
  })
  url: string;

  @property({
    type: 'number',
    required: true,
  })
  star: number;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  albumId: string;

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
