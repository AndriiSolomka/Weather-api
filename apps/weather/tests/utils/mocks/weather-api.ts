import { HttpResponse, JsonBodyType, http } from 'msw';

export const weatherApi = {
  mock: (fn: (city: string | null) => HttpResponse<JsonBodyType>) => {
    return http.get(
      'http://api.weatherapi.com/v1/current.json',
      ({ request }) => {
        const url = new URL(request.url);
        const city = url.searchParams.get('q');
        return fn(city);
      },
    );
  },
  ok: () =>
    weatherApi.mock((city) =>
      HttpResponse.json({
        location: { name: city },
        current: { temp_c: 20, humidity: 50, condition: { text: 'Sunny' } },
      }),
    ),
  notFound: () =>
    weatherApi.mock(() =>
      HttpResponse.json(
        {
          error: {
            code: 1006,
            message: 'No matching location found.',
          },
        },
        { status: 400 },
      ),
    ),
};
