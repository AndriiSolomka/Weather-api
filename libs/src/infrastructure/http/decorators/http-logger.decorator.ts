import { HttpClientInterface } from '../../../core/http/http.interface';
import { LoggerInterface } from '../../../core/logger/logger.interface';
import { LoggingDecoratorBase } from '../../../infrastructure/logger/logger.abstract';

export class LoggingHttpClient
  extends LoggingDecoratorBase<HttpClientInterface>
  implements HttpClientInterface
{
  constructor(
    protected override readonly wrapped: HttpClientInterface,
    protected override readonly logger: LoggerInterface,
  ) {
    super(wrapped, logger, 'HttpClient');
  }

  async get<T>(url: string): Promise<T> {
    return this.logAndExecute('http_get', { url }, () =>
      this.wrapped.get<T>(url),
    );
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    return this.logAndExecute('http_post', { url, data }, () =>
      this.wrapped.post<T>(url, data),
    );
  }
}
