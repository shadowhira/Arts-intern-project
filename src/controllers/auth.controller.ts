import {post, get, requestBody, response} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {repository} from '@loopback/repository';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {authenticate} from '@loopback/authentication';
import {UserProfile, SecurityBindings, securityId} from '@loopback/security';
import {inject} from '@loopback/core';
import {Request, RestBindings, HttpErrors} from '@loopback/rest';
import multer from 'multer';

const SECRET_KEY = 'jwt_secret';
const REFRESH_SECRET_KEY = 'jwt_secret_refresh';

const storage = multer.memoryStorage();
const upload = multer({storage});
export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate('jwt')
  @get('/me')
  async userinfo(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<UserProfile> {
    return user;
  }

  @post('/check-email')
  @response(200, {
    description: 'Check if email exists',
    content: {
      'application/json': {
        schema: {type: 'object', properties: {exists: {type: 'boolean'}}},
      },
    },
  })
  async checkEmail(
    @inject(RestBindings.Http.REQUEST) request: Request,
  ): Promise<{exists: boolean}> {
    return new Promise((resolve, reject) => {
      upload.single('email')(request, null as any, async err => {
        if (err) {
          reject(
            new HttpErrors.BadRequest('Error processing multipart request'),
          );
          return;
        }

        const email = request.body.email;
        if (!email) {
          reject(new HttpErrors.BadRequest('Email is required'));
          return;
        }

        try {
          const user = await this.userRepository.findOne({where: {email}});
          resolve({exists: !!user});
        } catch (error) {
          reject(new HttpErrors.InternalServerError('Error checking email'));
        }
      });
    });
  }

  @post('/login')
  @response(200, {
    description: 'User login',
    content: {
      'application/json': {
        schema: {type: 'object', properties: {token: {type: 'string'}}},
      },
    },
  })
  async login(
    @inject(RestBindings.Http.REQUEST) request: Request,
  ): Promise<{accessToken: string; refreshToken: string} | {success: boolean}> {
    return new Promise((resolve, reject) => {
      upload.fields([
        {name: 'email', maxCount: 1},
        {name: 'password', maxCount: 1},
      ])(request, null as any, async err => {
        if (err) reject(new HttpErrors.BadRequest('Error processing request'));

        const {email, password} = request.body;
        if (!email || !password) {
          reject(
            new HttpErrors.BadRequest('Username and password are required'),
          );
        }

        // Kiểm tra thông tin đăng nhập
        try {
          const user = await this.userRepository.findOne({
            where: {email},
          });
          if (!user) {
            resolve({success: false});
            return;
          }

          const passwordMatched = await bcrypt.compare(password, user.password);
          if (!passwordMatched) {
            resolve({success: false});
            return;
          }

          const accessToken = jwt.sign(
            {id: user.id, email: user.email, role: user.role},
            SECRET_KEY,
            {expiresIn: '1m'},
          );
  
          const refreshToken = jwt.sign(
            {id: user.id},
            REFRESH_SECRET_KEY,
            {expiresIn: '7d'},
          );
  
          resolve({accessToken, refreshToken});
        } catch (error) {
          reject(new HttpErrors.InternalServerError(error.message));
        }
      });
    });
  }

  @post('/signup')
  @response(200, {
    description: 'User Signup',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {type: 'boolean'},
            message: {type: 'string'},
          },
        },
      },
    },
  })
  async signup(
    @inject(RestBindings.Http.REQUEST) request: Request,
  ): Promise<{success: boolean; message: string}> {
    return new Promise((resolve, reject) => {
      upload.fields([
        {name: 'username', maxCount: 1},
        {name: 'password', maxCount: 1},
        {name: 'email', maxCount: 1},
      ])(request, null as any, async err => {
        if (err) {
          reject(
            new HttpErrors.BadRequest('Error processing multipart request'),
          );
          return;
        }

        const {username, password, email} = request.body;
        if (!username || !password || !email) {
          reject(new HttpErrors.BadRequest('Missing required fields'));
          return;
        }

        // Check if email already exists
        const existingUser = await this.userRepository.findOne({
          where: {email},
        });
        if (existingUser) {
          resolve({
            success: false,
            message: 'Email đã tồn tại trong hệ thống.',
          });
          return;
        }

        try {
          const passwordHash = await bcrypt.hash(password, 10);
          await this.userRepository.create({
            username,
            password: passwordHash,
            email,
            role: ['user'],
          });
          resolve({success: true, message: 'User created successfully'});
        } catch (error) {
          reject(new HttpErrors.InternalServerError('Failed to create user'));
        }
      });
    });
  }

  @post('/refresh-token')
  @authenticate('jwt')
  async refreshToken(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<{token: string}> {
    const token = jwt.sign(
      {id: user[securityId], email: user.email, role: user.roles},
      SECRET_KEY,
      {expiresIn: '1h'},
    );
    return {token};
  }
}
