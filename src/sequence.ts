import {
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import multer from 'multer';
import {AuthenticateFn, AuthenticationBindings} from '@loopback/authentication';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) {}

  async handle(context: RequestContext) {
    const {request, response} = context;

    // Thiết lập cấu hình multer cho upload hình ảnh
    const storage = multer.memoryStorage();
    const upload = multer({storage});
    if (request.method === 'POST' && request.url === '/images') {
      await new Promise<void>((resolve, reject) => {
        upload.single('file')(request, response, (err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // CORS setup
    response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.header(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE',
    );
    response.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );

    // Xử lý yêu cầu OPTIONS để phản hồi preflight request
    if (request.method === 'OPTIONS') {
      response.status(200).end();
      return; // Kết thúc sớm với yêu cầu OPTIONS
    }

    try {
      const route = this.findRoute(request);

      // Thực hiện quá trình xác thực người dùng
      await this.authenticateRequest(request); // gọi xác thực

      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      const errorDetails = err.details ? JSON.stringify(err.details) : '';
      const stack = err.stack || '';

      console.error(
        `Error: ${message}\nStatusCode: ${statusCode}\nDetails: ${errorDetails}\nStack: ${stack}`,
      );

      this.reject(context, err);
    }
  }
}
