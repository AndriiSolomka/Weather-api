import { Code, ConnectError } from '@connectrpc/connect';

export class NotFoundError extends ConnectError {
  constructor(entity: string, value?: string) {
    super(
      value ? `${entity} "${value}" not found` : `${entity} not found`,
      Code.NotFound,
    );
    this.name = 'NotFoundError';
  }
}
