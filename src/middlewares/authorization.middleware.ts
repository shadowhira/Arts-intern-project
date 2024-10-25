import {Middleware, MiddlewareContext, MiddlewareSequence} from '@loopback/rest';
import {verify} from 'jsonwebtoken';

const SECRET_KEY = 'jwt_secret'; // Thay thế bằng secret key của bạn

export const extractRoleFromToken: Middleware = async (middlewareCtx: MiddlewareContext, next: Function) => {
  const {request, response} = middlewareCtx;
  const token = request.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return response.status(401).send('Unauthorized'); // Trả về ngay khi không có token
  }

  try {
    const payload: any = verify(token, SECRET_KEY);
    console.log('payload.role: ', payload.role);
    (request as any).role = payload.role; // Gắn role vào request object
    
    // Chỉ gọi next() khi không có lỗi
    return await next();
  } catch (err) {
    console.log('Invalid token');
    return response.status(401).send('Invalid Token'); // Trả về ngay nếu token không hợp lệ
  }
};