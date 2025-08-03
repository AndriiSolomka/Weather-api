import { HttpResponse, JsonBodyType, http } from 'msw';

export const searchApi = {
  mock: (fn: (city: string | null) => HttpResponse<JsonBodyType>) => {
    return http.get(
      'https://geocoding-api.open-meteo.com/v1/search',
      ({ request }) => {
        const url = new URL(request.url);
        const city = url.searchParams.get('name');
        return fn(city);
      },
    );
  },
  ok: () =>
    searchApi.mock((city) =>
      HttpResponse.json({
        results: [
          {
            name: city,
            latitude: 50.45,
            longitude: 30.52,
          },
        ],
      }),
    ),

  notFound: () =>
    searchApi.mock(() =>
      HttpResponse.json(
        { results: [], generationtime_ms: 0.5 },
        { status: 200 },
      ),
    ),
};
