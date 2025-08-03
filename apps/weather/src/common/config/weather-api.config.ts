import { z } from 'zod';

export const WeatherApiConfigSchema = z.object({
  weatherApiKey: z.string().nonempty(),
  weatherApiUrl: z.url(),
  openMeteoApiUrl: z.url(),
  geocodingApiUrl: z.url(),
});

export type WeatherApiConfig = z.infer<typeof WeatherApiConfigSchema>;
