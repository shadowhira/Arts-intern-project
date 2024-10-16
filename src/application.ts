import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {JWTStrategy} from './authentication/jwt.strategy';

export {ApplicationConfig};
import {AuthenticationComponent} from '@loopback/authentication';
import {registerAuthenticationStrategy} from '@loopback/authentication';
import {errorHandlerMiddleware} from './middleware/error-handler.middleware';

export class ArtsApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // middleware
    this.middleware(errorHandlerMiddleware);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // add jwt
    this.bind('jwt.secret').to('jwt_secret');
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);
  }
}
