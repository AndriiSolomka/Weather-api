import { HttpException } from '../../common/errors/http.error';
import { HttpClientInterface } from '../../core/http/http.interface';
import { LoggerInterface } from '../../core/logger/logger.interface';

export class HttpClient implements HttpClientInterface {
  constructor(private readonly logger: LoggerInterface) {}
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      const errorMessage = `Failed to fetch data: ${response.status}, ${response.statusText}`;

      this.logger.error({
        context: HttpClient.name,
        method: 'get',
        status: 'failed',
        params: { url },
        error: errorMessage,
      });

      throw new HttpException(errorMessage, response.status);
    }

    this.logger.info({
      context: HttpClient.name,
      status: 'success',
      method: 'get',
      params: { url },
    });

    return (await response.json()) as T;
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = `Failed to post data: ${response.status}, ${response.statusText}`;

      this.logger.error({
        context: HttpClient.name,
        method: 'post',
        status: 'failed',
        params: { url, data },
        error: errorMessage,
      });

      throw new HttpException(errorMessage, response.status);
    }

    this.logger.info({
      context: HttpClient.name,
      status: 'success',
      method: 'post',
      params: { url, data },
    });

    return (await response.json()) as T;
  }
}
