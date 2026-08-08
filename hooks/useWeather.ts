import { useQuery } from '@tanstack/react-query';
import { fetchWeatherFromApi } from '../services/weatherApi';
import { getCachedWeatherData, cacheWeatherData } from '../services/storage';
import { WeatherData } from '../types/weather';
import { useAppStore } from '../store/useAppStore';

export function useWeather(cityName: string, lat: number, lon: number, cityId: string) {
  const setOfflineMode = useAppStore(state => state.setOfflineMode);

  return useQuery<WeatherData>({
    queryKey: ['weather', cityId, cityName, lat, lon],
    queryFn: async () => {
      try {
        const liveData = await fetchWeatherFromApi(cityName, lat, lon);
        await cacheWeatherData(cityId, liveData);
        setOfflineMode(false);
        return liveData;
      } catch (error) {
        console.warn(`Error fetching live weather for ${cityName}, retrieving cache`, error);
        setOfflineMode(true);
        const cached = await getCachedWeatherData(cityId);
        if (cached) return cached;
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
}
