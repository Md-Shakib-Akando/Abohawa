import * as Location from 'expo-location';
import { CityLocation } from '../types/weather';

export async function getCurrentDeviceLocation(): Promise<CityLocation | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission not granted, using default location.');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const [place] = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const cityName = place?.city || place?.district || place?.subregion || place?.name || place?.region || 'Current Location';
    const countryName = place?.country || place?.isoCountryCode || '';

    return {
      id: `gps-${location.coords.latitude.toFixed(2)}-${location.coords.longitude.toFixed(2)}`,
      name: cityName,
      country: countryName,
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      isCurrentLocation: true,
    };
  } catch (error) {
    console.warn('Could not retrieve device location:', error);
    return null;
  }
}
