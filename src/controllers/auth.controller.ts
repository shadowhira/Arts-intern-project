import {post, get, requestBody} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {repository} from '@loopback/repository';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {authenticate} from '@loopback/authentication';
import {UserProfile, SecurityBindings, securityId} from '@loopback/security';
import {inject} from '@loopback/core';

const SECRET_KEY = 'jwt_secret';

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @get('/userinfo')
  @authenticate('jwt')
  async userinfo(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<UserProfile> {
    return user;
  }

  @post('/login')
  async login(
    @requestBody() credentials: {username: string; password: string},
  ): Promise<{token: string} | {success: boolean}> {
    const user = await this.userRepository.findOne({
      where: {username: credentials.username},
    });
    if (!user) {
      return {success: false};
    }
    const passwordMatched = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!passwordMatched) {
      return {success: false};
    }
    const token = jwt.sign(
      {id: user.id, username: user.username, role: user.role},
      SECRET_KEY,
      {expiresIn: '1h'},
    );
    return {token};
  }

  @post('/signup')
  async signup(
    @requestBody() newUser: {username: string; password: string; email: string},
  ): Promise<{success: boolean, message: string}> {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUserByEmail = await this.userRepository.findOne({
      where: {email: newUser.email},
    });

    if (existingUserByEmail) {
      return {success: false, message: 'Email đã tồn tại trong hệ thống.'};
    }

    const passwordHash = await bcrypt.hash(newUser.password, 10);
    try {
      await this.userRepository.create({
        ...newUser,
        password: passwordHash,
        role: ['user'],
      });
      return {success: true, message: 'User created successfully'};
    } catch (error) {
      return {success: false, message: 'Failed to create user'};
    }
  }

  @post('/refresh-token')
  @authenticate('jwt')
  async refreshToken(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<{token: string}> {
    const token = jwt.sign(
      {id: user[securityId], username: user.name, role: user.roles},
      SECRET_KEY,
      {expiresIn: '1h'},
    );
    return {token};
  }
}
