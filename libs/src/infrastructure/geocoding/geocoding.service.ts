import {
  City,
  Coordinates,
  GeocodingInterface,
} from '../../core/geocoding/geocoding.interface';
import { HttpClientInterface } from '../../core/http/http.interface';

type GeocodingResponse = {
  results: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    admin2_id: number;
    timezone: string;
    population: number;
    country_id: number;
    country: string;
    admin1: string;
    admin2: string;
  }[];
  generationtime_ms: number;
};

export class GeocodingService implements GeocodingInterface {
  constructor(
    private readonly httpService: HttpClientInterface,
    private readonly geocodingUrl: string,
  ) {}

  async findCity(cityName: string): Promise<City | null> {
    const url = this.buildCityUrl(cityName);
    const response = await this.httpService.get<GeocodingResponse>(url);

    const city = response.results?.[0];
    if (!city) return null;

    const { id, name, latitude, longitude, country } = city;
    return { id, name, coordinates: { latitude, longitude }, country };
  }

  async getCityCoordinates(city: string): Promise<Coordinates | null> {
    const result = await this.findCity(city);
    return result?.coordinates ?? null;
  }

  private buildCityUrl(city: string): string {
    return `${this.geocodingUrl}/search?name=${city}`;
  }
}
