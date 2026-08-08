import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Search, MapPin, Plus, X } from 'lucide-react-native';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { CityCard } from '../../components/CityCard';
import { searchCities } from '../../services/geocoding';
import { CityLocation } from '../../types/weather';
import { useAppStore } from '../../store/useAppStore';
import { TRANSLATIONS } from '../../constants/i18n';
import { THEME } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { useWeather } from '../../hooks/useWeather';

export default function CitiesScreen() {
  const router = useRouter();
  const {
    activeCity,
    savedCities,
    setActiveCity,
    addSavedCity,
    removeSavedCity,
    language,
    previewCondition,
  } = useAppStore();

  const t = TRANSLATIONS[language];
  const { data: weather } = useWeather(activeCity.name, activeCity.lat, activeCity.lon, activeCity.id);
  const conditionCode = previewCondition || weather?.conditionCode || 'PartlyCloudy';
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchCities(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectCity = (city: CityLocation) => {
    setActiveCity(city);
    setQuery('');
    setSearchResults([]);
    router.push('/(tabs)');
  };

  const handleAddCity = (city: CityLocation) => {
    addSavedCity(city);
    setActiveCity(city);
    setQuery('');
    setSearchResults([]);
    router.push('/(tabs)');
  };

  return (
    <AnimatedBackground conditionCode={conditionCode} tempC={weather?.tempC}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.pageTitle}>{t.cities.title}</Text>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <Search size={18} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder={t.sections.searchCityPlaceholder}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={18} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Results Dropdown */}
          {query.length > 0 && (
            <View style={styles.resultsOverlay}>
              {isSearching ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#56CCF2" />
                  <Text style={styles.loadingText}>Searching cities...</Text>
                </View>
              ) : searchResults.length > 0 ? (
                searchResults.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    style={styles.resultItem}
                    onPress={() => handleAddCity(city)}
                  >
                    <View style={styles.resultTextCol}>
                      <Text style={styles.resultName}>{city.name}</Text>
                      <Text style={styles.resultCountry}>{city.country}</Text>
                    </View>
                    <Plus size={18} color="#56CCF2" />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>No cities found for "{query}"</Text>
              )}
            </View>
          )}

          {/* Saved Cities List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionHeader}>{t.sections.savedCities}</Text>

            {savedCities.length > 0 ? (
              savedCities.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  isActive={activeCity.id === city.id}
                  onSelect={handleSelectCity}
                  onDelete={removeSavedCity}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <MapPin size={32} color="rgba(255, 255, 255, 0.4)" />
                <Text style={styles.emptyText}>{t.cities.noSavedCities}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: THEME.spacing.md,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 10,
  },
  resultsOverlay: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 10,
    fontSize: 14,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  resultTextCol: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultCountry: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  noResultsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 12,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
