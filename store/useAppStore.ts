import { create } from 'zustand';
import { CityLocation, WeatherCode } from '../types/weather';
import { Language } from '../constants/i18n';
import { PRESET_CITIES } from '../services/geocoding';
import { getCurrentDeviceLocation } from '../services/location';
import {
  getSavedCitiesFromStorage,
  saveCitiesToStorage,
  getActiveCityFromStorage,
  setActiveCityInStorage,
} from '../services/storage';

export type UnitSystem = 'metric' | 'imperial';
export type ThemeMode = 'auto' | 'light' | 'dark';

interface AppState {
  activeCity: CityLocation;
  savedCities: CityLocation[];
  unitSystem: UnitSystem;
  language: Language;
  themeMode: ThemeMode;
  reduceMotion: boolean;
  offlineMode: boolean;
  isHydrated: boolean;
  previewCondition?: WeatherCode;

  // Actions
  setActiveCity: (city: CityLocation) => void;
  addSavedCity: (city: CityLocation) => void;
  removeSavedCity: (cityId: string) => void;
  setUnitSystem: (unit: UnitSystem) => void;
  setLanguage: (lang: Language) => void;
  setThemeMode: (theme: ThemeMode) => void;
  setReduceMotion: (reduce: boolean) => void;
  setOfflineMode: (offline: boolean) => void;
  setPreviewCondition: (code?: WeatherCode) => void;
  detectDeviceLocation: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeCity: PRESET_CITIES[0], // Dhaka default
  savedCities: PRESET_CITIES.slice(0, 5),
  unitSystem: 'metric',
  language: 'en',
  themeMode: 'auto',
  reduceMotion: false,
  offlineMode: false,
  isHydrated: false,
  previewCondition: undefined,

  setActiveCity: (city) => {
    set({ activeCity: city });
    setActiveCityInStorage(city);
  },

  addSavedCity: (city) => {
    const current = get().savedCities;
    const filtered = city.isCurrentLocation
      ? current.filter(c => !c.isCurrentLocation && c.name.toLowerCase() !== city.name.toLowerCase())
      : current.filter(c => c.id !== city.id && !(c.name.toLowerCase() === city.name.toLowerCase() && c.country === city.country));
    const updated = [city, ...filtered];
    set({ savedCities: updated });
    saveCitiesToStorage(updated);
  },

  removeSavedCity: (cityId) => {
    const updated = get().savedCities.filter(c => c.id !== cityId);
    set({ savedCities: updated });
    saveCitiesToStorage(updated);
  },

  setUnitSystem: (unitSystem) => set({ unitSystem }),
  setLanguage: (language) => set({ language }),
  setThemeMode: (themeMode) => set({ themeMode }),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  setOfflineMode: (offlineMode) => set({ offlineMode }),
  setPreviewCondition: (previewCondition) => set({ previewCondition }),

  detectDeviceLocation: async () => {
    const gpsCity = await getCurrentDeviceLocation();
    if (gpsCity) {
      get().addSavedCity(gpsCity);
      get().setActiveCity(gpsCity);
    }
  },

  hydrate: async () => {
    try {
      const storedCities = await getSavedCitiesFromStorage();
      const storedActive = await getActiveCityFromStorage();

      if (storedCities.length > 0) {
        set({ savedCities: storedCities });
      }
      if (storedActive) {
        set({ activeCity: storedActive });
      }

      set({ isHydrated: true });

      // Automatically attempt device GPS location detection on open
      get().detectDeviceLocation();
    } catch (e) {
      console.warn('Hydration error:', e);
      set({ isHydrated: true });
    }
  },
}));
