import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {Request} from '@loopback/rest';
import {inject} from '@loopback/core';
import * as jwt from 'jsonwebtoken';

export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject('jwt.secret') private jwtSecret: string,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const payload = jwt.verify(token, this.jwtSecret) as any;
    const userProfile: UserProfile = {
      [securityId]: payload.id.toString(),
      name: payload.username,
      roles: payload.role,
    };
    return userProfile;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new Error('Authorization header not found.');
    }
    const authHeaderValue = request.headers.authorization;
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new Error('Authorization header is not of type Bearer.');
    }
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new Error('Authorization header value has too many parts.');
    return parts[1];
  }
}
