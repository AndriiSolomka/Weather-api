import { Code, ConnectError } from '@connectrpc/connect';

export class InternalServerError extends ConnectError {
  constructor(message: string) {
    super(message, Code.Internal);
    this.name = 'InternalServerError';
  }
}
