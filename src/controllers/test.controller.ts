import {get} from '@loopback/rest';

export class TestController {
  @get('/error')
  throwError() {
    throw new Error('This is a test error');
  }
}
