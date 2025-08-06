import { HttpResponse, JsonBodyType, http } from 'msw';

export const openMeteoApi = {
  mock: (
    fn: (
      latitude: string | null,
      longitude: string | null,
    ) => HttpResponse<JsonBodyType>,
  ) => {
    return http.get('https://api.open-meteo.com/v1/forecast', ({ request }) => {
      const url = new URL(request.url);
      const lat = url.searchParams.get('latitude');
      const lon = url.searchParams.get('longitude');
      return fn(lat, lon);
    });
  },

  ok: () =>
    openMeteoApi.mock(() =>
      HttpResponse.json({
        current: {
          temperature_2m: 18,
          relative_humidity_2m: 65,
          weather_code: 1,
        },
      }),
    ),

  error: () =>
    openMeteoApi.mock(() =>
      HttpResponse.json(
        {
          error: {
            code: 500,
            message: 'Something went wrong',
          },
        },
        { status: 500 },
      ),
    ),
};
