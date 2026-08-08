import { CityLocation } from '../types/weather';

export const PRESET_CITIES: CityLocation[] = [
  { id: 'dhaka-bd', name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lon: 90.4125 },
  { id: 'chittagong-bd', name: 'Chittagong', country: 'Bangladesh', lat: 22.3569, lon: 91.7832 },
  { id: 'sylhet-bd', name: 'Sylhet', country: 'Bangladesh', lat: 24.8949, lon: 91.8687 },
  { id: 'london-uk', name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { id: 'tokyo-jp', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { id: 'newyork-us', name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { id: 'sydney-au', name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { id: 'paris-fr', name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { id: 'dubai-ae', name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
];

export async function searchCities(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim().toLowerCase();

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=8&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding search failed');
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      return data.results.map((item: any) => ({
        id: `${item.name.toLowerCase()}-${item.country_code?.toLowerCase() || 'loc'}-${item.id}`,
        name: item.name,
        country: item.country || item.admin1 || '',
        lat: item.latitude,
        lon: item.longitude,
      }));
    }
  } catch (error) {
    console.warn('Geocoding API search error, filtering presets:', error);
  }

  // Fallback preset filter
  return PRESET_CITIES.filter(c =>
    c.name.toLowerCase().includes(cleanQuery) ||
    c.country.toLowerCase().includes(cleanQuery)
  );
}
