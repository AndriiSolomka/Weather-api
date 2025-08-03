import { HttpException } from '../../common/errors/http.error';
import { HttpClientInterface } from '../../core/http/http.interface';

export class HttpClient implements HttpClientInterface {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      const errorMessage = `Failed to fetch data: ${response.status}, ${response.statusText}`;
      throw new HttpException(errorMessage, response.status);
    }

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
      throw new HttpException(errorMessage, response.status);
    }

    return (await response.json()) as T;
  }
}
