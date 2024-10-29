import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {Request} from '@loopback/rest';
import {inject} from '@loopback/core';
import * as jwt from 'jsonwebtoken';
import {UserRepository} from '../repositories';
import {repository} from '@loopback/repository';

const SECRET_KEY = 'jwt_secret';
export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject('jwt.secret') private jwtSecret: string,
    @repository(UserRepository) private userRepository: UserRepository,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const payload = jwt.verify(token, this.jwtSecret) as any;

    // Tìm user theo email
    const user = await this.userRepository.findOne({
      where: {email: payload.email},
    });

    if (!user) {
      throw new Error('User not found');
    }

    const userProfile: UserProfile = {
      [securityId]: payload.id.toString(),
      name: user.username, 
      email: payload.email,
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