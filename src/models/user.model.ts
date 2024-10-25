import {Entity, model, property, hasMany} from '@loopback/repository';
import {Album} from './album.model';
import {Notification} from './notification.model';
import {Follow} from './follow.model';
import {Image} from './image.model';

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {minLength: 3},
  })
  username: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {minLength: 6},
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {format: 'email'},
  })
  email: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: ['user'],
  })
  role?: string[];

  @hasMany(() => Album)
  albums: Album[];

  @hasMany(() => Notification)
  notifications: Notification[];
  
  @hasMany(() => Image)
  images: Image[];
  
  @hasMany(() => User, {through: {model: () => Follow, keyFrom: 'followerId', keyTo: 'followingId'}})
  followings: User[];

  @hasMany(() => User, {through: {model: () => Follow, keyFrom: 'followingId', keyTo: 'followerId'}})
  followers: User[];  

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
