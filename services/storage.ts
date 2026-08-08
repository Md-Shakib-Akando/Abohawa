import AsyncStorage from '@react-native-async-storage/async-storage';
import { CityLocation, WeatherData } from '../types/weather';

const STORAGE_KEYS = {
  SAVED_CITIES: '@skyra_saved_cities',
  ACTIVE_CITY: '@skyra_active_city',
  UNIT_SYSTEM: '@skyra_unit_system',
  LANGUAGE: '@skyra_language',
  THEME_MODE: '@skyra_theme_mode',
  REDUCE_MOTION: '@skyra_reduce_motion',
  WEATHER_CACHE: '@skyra_weather_cache_',
};

export async function getSavedCitiesFromStorage(): Promise<CityLocation[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_CITIES);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Failed to load saved cities', error);
    return [];
  }
}

export async function saveCitiesToStorage(cities: CityLocation[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_CITIES, JSON.stringify(cities));
  } catch (error) {
    console.error('Failed to save cities', error);
  }
}

export async function getActiveCityFromStorage(): Promise<CityLocation | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_CITY);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function setActiveCityInStorage(city: CityLocation): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CITY, JSON.stringify(city));
  } catch (error) {
    console.error('Failed to set active city', error);
  }
}

export async function cacheWeatherData(cityId: string, data: WeatherData): Promise<void> {
  try {
    await AsyncStorage.setItem(`${STORAGE_KEYS.WEATHER_CACHE}${cityId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to cache weather data', error);
  }
}

export async function getCachedWeatherData(cityId: string): Promise<WeatherData | null> {
  try {
    const json = await AsyncStorage.getItem(`${STORAGE_KEYS.WEATHER_CACHE}${cityId}`);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function clearAllWeatherCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(STORAGE_KEYS.WEATHER_CACHE));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Failed to clear cache', error);
  }
}
