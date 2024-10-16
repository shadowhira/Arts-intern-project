import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {inject} from '@loopback/core';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
  ) {}

  async handle(context: RequestContext) {
    const {request, response} = context;
    try {
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      // Log lỗi 
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      const errorDetails = err.details ? JSON.stringify(err.details) : '';
      const stack = err.stack || '';

      console.error(
        `Error: ${message}\nStatusCode: ${statusCode}\nDetails: ${errorDetails}\nStack: ${stack}`,
      );

      // Xử lý lỗi bằng reject để trả về phản hồi cho client
      this.reject(context, err);
    }
  }
}
