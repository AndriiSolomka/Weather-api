export type WeatherData = {
  temperature: number;
  humidity: number;
  description: string;
};

export interface WeatherInterface {
  getWeather(city: string): Promise<WeatherData>;
}
