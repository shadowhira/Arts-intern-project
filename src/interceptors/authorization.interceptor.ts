import {Provider, inject, ValueOrPromise} from '@loopback/core';
import {
  Interceptor,
  InvocationContext,
  InvocationResult,
  InterceptorOrKey,
  bind,
} from '@loopback/context';
import {verify} from 'jsonwebtoken';
import {Request, Response} from 'express';

import {UserRepository} from '../repositories';

const SECRET_KEY = 'jwt_secret';

export class CheckAdminInterceptor implements Provider<Interceptor> {
  constructor() {}
  value() {
    return this.intercept.bind(this);
  }

  async intercept<T>(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<T>,
  ) {
    const req: Request = await invocationCtx.get('rest.http.request');
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new Error('Token is undefined');
    }
    const payload: any = verify(token, SECRET_KEY);

    const userId = payload.id;

    const userRepo = await invocationCtx.get<UserRepository>(
      'repositories.UserRepository',
    );
    const user = await userRepo.findById(userId);
    if (user.id === userId && user.role?.includes('admin')) {
      return next();
    }
    throw new Error('Unauthorized');
  }
}

export class CheckAuthorInterceptor implements Provider<Interceptor> {
  constructor() {}
  value() {
    return this.intercept.bind(this);
  }

  async intercept<T>(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<T>,
  ) {
    const req: Request = await invocationCtx.get('rest.http.request');
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new Error('Token is undefined');
    }
    const payload: any = verify(token, SECRET_KEY);

    const userId = payload.id;

    const userRepo = await invocationCtx.get<UserRepository>(
      'repositories.UserRepository',
    );
    const user = await userRepo.findById(userId);
    if (user.id === userId && user.role?.includes('author')) {
      return next();
    }
    throw new Error('Unauthorized');
  }
}

export class CheckUserInterceptor implements Provider<Interceptor> {
  constructor() {}
  value() {
    return this.intercept.bind(this);
  }

  async intercept<T>(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<T>,
  ) {
    const req: Request = await invocationCtx.get('rest.http.request');
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new Error('Token is undefined');
    }
    const payload: any = verify(token, SECRET_KEY);

    const userId = payload.id;

    const userRepo = await invocationCtx.get<UserRepository>(
      'repositories.UserRepository',
    );
    const user = await userRepo.findById(userId);
    if (user.id === userId && user.role?.includes('user')) {
      return next();
    }
    throw new Error('Unauthorized');
  }
}
