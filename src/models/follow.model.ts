import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Follow extends Entity {
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
  followerId: string;

  @property({
    type: 'string',
    required: true,
  })
  followingId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Follow>) {
    super(data);
  }
}

export interface FollowRelations {
  // describe navigational properties here
}

export type FollowWithRelations = Follow & FollowRelations;
