import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Droplets, Wind, Eye, ShieldAlert } from 'lucide-react-native';
import { HourlyForecast } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { useAppStore } from '../store/useAppStore';
import { TRANSLATIONS } from '../constants/i18n';
import { THEME } from '../constants/theme';

interface HourlyStripProps {
  hourly: HourlyForecast[];
}

export function HourlyStrip({ hourly }: HourlyStripProps) {
  const { unitSystem, language } = useAppStore();
  const t = TRANSLATIONS[language];
  const [selectedHour, setSelectedHour] = useState<HourlyForecast | null>(null);

  if (!hourly || hourly.length === 0) return null;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.sectionTitle}>{t.sections.hourly}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourly.slice(0, 24).map((item, idx) => {
          const temp = unitSystem === 'metric' ? item.tempC : item.tempF;
          const isCurrentHour = idx === 0;

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedHour(item)}
              activeOpacity={0.7}
              style={[
                styles.hourItem,
                isCurrentHour && styles.currentHourItem,
              ]}
            >
              <Text style={[styles.timeText, isCurrentHour && styles.activeTimeText]}>
                {isCurrentHour ? t.hero.justNow : item.time}
              </Text>

              <View style={styles.iconContainer}>
                <WeatherIcon code={item.conditionCode} size={26} />
              </View>

              <Text style={styles.tempText}>{temp}°</Text>

              {item.pop > 20 ? (
                <View style={styles.popBadge}>
                  <Droplets size={10} color="#4D96FF" />
                  <Text style={styles.popText}>{item.pop}%</Text>
                </View>
              ) : (
                <View style={styles.popSpacer} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Hourly Detail Popover Modal */}
      {selectedHour && (
        <Modal
          transparent
          animationType="fade"
          visible={!!selectedHour}
          onRequestClose={() => setSelectedHour(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedHour(null)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTime}>{selectedHour.time}</Text>
                <WeatherIcon code={selectedHour.conditionCode} size={32} />
              </View>

              <Text style={styles.modalTemp}>
                {unitSystem === 'metric' ? selectedHour.tempC : selectedHour.tempF}°
                {' '}{selectedHour.conditionText}
              </Text>

              <View style={styles.modalGrid}>
                <View style={styles.modalGridItem}>
                  <Droplets size={16} color="#4D96FF" />
                  <Text style={styles.modalItemLabel}>{t.stats.chanceOfRain}</Text>
                  <Text style={styles.modalItemVal}>{selectedHour.pop}% ({selectedHour.precipMm} mm)</Text>
                </View>

                <View style={styles.modalGridItem}>
                  <Wind size={16} color="#56CCF2" />
                  <Text style={styles.modalItemLabel}>{t.stats.wind}</Text>
                  <Text style={styles.modalItemVal}>
                    {unitSystem === 'metric' ? `${selectedHour.windSpeedKmh} km/h` : `${Math.round(selectedHour.windSpeedKmh * 0.62)} mph`}
                  </Text>
                </View>

                <View style={styles.modalGridItem}>
                  <Eye size={16} color="#FFD93D" />
                  <Text style={styles.modalItemLabel}>{t.stats.humidity}</Text>
                  <Text style={styles.modalItemVal}>{selectedHour.humidity}%</Text>
                </View>

                <View style={styles.modalGridItem}>
                  <ShieldAlert size={16} color="#FF9800" />
                  <Text style={styles.modalItemLabel}>{t.stats.uvIndex}</Text>
                  <Text style={styles.modalItemVal}>{selectedHour.uvIndex}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedHour(null)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: THEME.card.borderRadius,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    marginHorizontal: THEME.spacing.md,
    marginVertical: THEME.spacing.sm,
    paddingVertical: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.md,
  },
  hourItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 62,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  currentHourItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  activeTimeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  iconContainer: {
    marginVertical: 6,
  },
  tempText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  popBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  popText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4D96FF',
    marginLeft: 2,
  },
  popSpacer: {
    height: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTime: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalTemp: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 16,
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modalGridItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  modalItemLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 4,
  },
  modalItemVal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
