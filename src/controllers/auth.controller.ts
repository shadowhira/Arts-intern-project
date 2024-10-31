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
const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '2h';
const ACCESS_TIME = 900;
const REFRESH_TIME = 7200;

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
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
            },
            required: ['email'],
          },
        },
      },
    }) body: {email: string},
  ): Promise<{exists: boolean}> {
    const {email} = body;
    if (!email) {
      throw new HttpErrors.BadRequest('Email is required');
    }
  
    try {
      const user = await this.userRepository.findOne({where: {email}});
      return {exists: !!user};
    } catch (error) {
      throw new HttpErrors.InternalServerError('Error checking email');
    }
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
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['email', 'password'],
          },
        },
      },
    })
    credentials: {
      email: string;
      password: string;
    },
  ): Promise<
    | {
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresIn: number;
        refreshTokenExpiresIn: number;
        roles: string[];
      }
    | {success: boolean}
  > {
    const {email, password} = credentials;
    if (!email || !password) {
      throw new HttpErrors.BadRequest('Username and password are required');
    }
    try {
      const user = await this.userRepository.findOne({
        where: {email},
      });
      if (!user) {
        return {success: false};
      }

      const passwordMatched = await bcrypt.compare(password, user.password);
      if (!passwordMatched) {
        return {success: false};
      }

      const accessToken = jwt.sign(
        {id: user.id, email: user.email, role: user.role},
        SECRET_KEY,
        {expiresIn: ACCESS_EXPIRES_IN},
      );

      const refreshToken = jwt.sign(
        {id: user.id, email: user.email, role: user.role},
        SECRET_KEY,
        {
          expiresIn: REFRESH_EXPIRES_IN,
        },
      );

      return {
        accessToken,
        refreshToken,
        accessTokenExpiresIn: ACCESS_TIME,
        refreshTokenExpiresIn: REFRESH_TIME,
        roles: user.role || [],
      };
    } catch (error) {
      throw new HttpErrors.InternalServerError(error.message);
    }
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
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: {type: 'string'},
              password: {type: 'string'},
              email: {type: 'string'},
            },
            required: ['username', 'password', 'email'],
          },
        },
      },
    }) body: {username: string; password: string; email: string},
  ): Promise<{success: boolean; message: string}> {
    const {username, password, email} = body;
    if (!username || !password || !email) {
      throw new HttpErrors.BadRequest('Missing required fields');
    }
  
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: {email},
    });
    if (existingUser) {
      return {
        success: false,
        message: 'Email đã tồn tại trong hệ thống.',
      };
    }
  
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      await this.userRepository.create({
        username,
        password: passwordHash,
        email,
        role: ['user'],
      });
      return {success: true, message: 'User created successfully'};
    } catch (error) {
      throw new HttpErrors.InternalServerError('Failed to create user');
    }
  }
  
  @post('/refresh-token')
  @response(200, {
    description: 'Refresh access token',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            accessToken: {type: 'string'},
            expiresIn: {type: 'number'},
          },
        },
      },
    },
  })
  async refreshToken(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              refreshToken: {type: 'string'},
            },
            required: ['refreshToken'],
          },
        },
      },
    }) body: {refreshToken: string},
  ): Promise<{accessToken: string; accessTokenExpiresIn: number}> {
    const {refreshToken} = body;
    if (!refreshToken) {
      throw new HttpErrors.BadRequest('Refresh token is required');
    }
  
    try {
      const payload = jwt.verify(refreshToken, SECRET_KEY) as any;
      const accessToken = jwt.sign(
        {id: payload.id, email: payload.email, role: payload.role},
        SECRET_KEY,
        {expiresIn: ACCESS_EXPIRES_IN},
      );
      return {accessToken, accessTokenExpiresIn: ACCESS_TIME}; // expiresIn in seconds
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid refresh token');
    }
  }
}
