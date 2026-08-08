import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Thermometer, Globe, Cpu, Trash2, Info } from 'lucide-react-native';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { useWeather } from '../../hooks/useWeather';
import { useAppStore } from '../../store/useAppStore';
import { clearAllWeatherCache } from '../../services/storage';
import { TRANSLATIONS } from '../../constants/i18n';
import { THEME } from '../../constants/theme';

export default function SettingsScreen() {
  const {
    activeCity,
    unitSystem,
    setUnitSystem,
    language,
    setLanguage,
    reduceMotion,
    setReduceMotion,
    previewCondition,
    setPreviewCondition,
  } = useAppStore();

  const t = TRANSLATIONS[language];
  const [clearing, setClearing] = useState(false);

  const { data: weather } = useWeather(activeCity.name, activeCity.lat, activeCity.lon, activeCity.id);
  const conditionCode = previewCondition || weather?.conditionCode || 'PartlyCloudy';

  const handleClearCache = async () => {
    setClearing(true);
    await clearAllWeatherCache();
    setClearing(false);
    Alert.alert('Success', t.settings.cacheCleared);
  };

  return (
    <AnimatedBackground conditionCode={conditionCode} tempC={weather?.tempC}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.pageTitle}>{t.settings.title}</Text>

          {/* Unit System */}
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <Thermometer size={20} color="#56CCF2" />
              <Text style={styles.cardTitle}>{t.settings.temperatureUnit}</Text>
            </View>

            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  unitSystem === 'metric' && styles.segmentActive,
                ]}
                onPress={() => setUnitSystem('metric')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    unitSystem === 'metric' && styles.segmentTextActive,
                  ]}
                >
                  {t.units.celsius}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  unitSystem === 'imperial' && styles.segmentActive,
                ]}
                onPress={() => setUnitSystem('imperial')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    unitSystem === 'imperial' && styles.segmentTextActive,
                  ]}
                >
                  {t.units.fahrenheit}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Language Switcher */}
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <Globe size={20} color="#FFD93D" />
              <Text style={styles.cardTitle}>{t.settings.language}</Text>
            </View>

            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  language === 'en' && styles.segmentActive,
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    language === 'en' && styles.segmentTextActive,
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  language === 'bn' && styles.segmentActive,
                ]}
                onPress={() => setLanguage('bn')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    language === 'bn' && styles.segmentTextActive,
                  ]}
                >
                  বাংলা (Bangla)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Accessibility & Motion */}
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <Cpu size={20} color="#6BCB77" />
              <Text style={styles.cardTitle}>{t.settings.reduceMotion}</Text>
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchLabelCol}>
                <Text style={styles.switchTitle}>{t.settings.reduceMotion}</Text>
                <Text style={styles.switchDesc}>{t.settings.reduceMotionDesc}</Text>
              </View>
              <Switch
                value={reduceMotion}
                onValueChange={setReduceMotion}
                trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#56CCF2' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Live Weather Simulator / Preview */}
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <Cpu size={20} color="#56CCF2" />
              <Text style={styles.cardTitle}>Live Weather UI Tester</Text>
            </View>

            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  !previewCondition && styles.segmentActive,
                ]}
                onPress={() => setPreviewCondition(undefined)}
              >
                <Text style={styles.segmentText}>Auto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  previewCondition === 'Rain' && styles.segmentActive,
                ]}
                onPress={() => setPreviewCondition('Rain')}
              >
                <Text style={styles.segmentText}>🌧️ Rain</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  previewCondition === 'Clear' && styles.segmentActive,
                ]}
                onPress={() => setPreviewCondition('Clear')}
              >
                <Text style={styles.segmentText}>☀️ Sun</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  previewCondition === 'Thunderstorm' && styles.segmentActive,
                ]}
                onPress={() => setPreviewCondition('Thunderstorm')}
              >
                <Text style={styles.segmentText}>🌩️ Storm</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Storage & Offline Cache */}
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <Trash2 size={20} color="#FF6B6B" />
              <Text style={styles.cardTitle}>{t.settings.offlineCache}</Text>
            </View>

            <TouchableOpacity
              style={styles.clearBtn}
              onPress={handleClearCache}
              disabled={clearing}
            >
              <Text style={styles.clearBtnText}>{t.settings.clearCache}</Text>
            </TouchableOpacity>
          </View>

          {/* App Info & Developer Credit */}
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <Info size={20} color="#56CCF2" />
              <Text style={styles.cardTitle}>{t.settings.aboutTitle}</Text>
            </View>

            <Text style={styles.infoText}>{t.settings.version}</Text>
            <View style={styles.devBadgeContainer}>
              <Text style={styles.devBadgeText}>{t.settings.developedBy}</Text>
            </View>
            <Text style={styles.infoTextSub}>{t.settings.apiProvider}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 16,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: THEME.spacing.md,
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: THEME.card.borderRadius,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    padding: THEME.spacing.md,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 14,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  segmentText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '600',
    fontSize: 14,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabelCol: {
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  switchDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  clearBtn: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderColor: 'rgba(255, 107, 107, 0.4)',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 14,
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  devBadgeContainer: {
    backgroundColor: 'rgba(86, 204, 242, 0.15)',
    borderColor: 'rgba(86, 204, 242, 0.35)',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  devBadgeText: {
    fontSize: 13,
    color: '#56CCF2',
    fontWeight: '600',
  },
  infoTextSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
});
