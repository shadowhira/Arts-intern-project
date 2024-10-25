import {Middleware, MiddlewareContext} from '@loopback/rest';
import {Request, Response} from 'express';
import {Next} from '@loopback/core';

export const errorHandlerMiddleware: Middleware = async (
  context: MiddlewareContext,
  next: Next,
) => {
  try {
    await next();
  } catch (err) {
    const res: Response = context.response;
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      error: {
        message: message,
        statusCode: statusCode,
      },
    });

    // Log
    console.error('Unhandled error:', err);
  }
};
