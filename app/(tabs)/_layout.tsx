import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Sun, BarChart2, MapPin, Settings } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { TRANSLATIONS } from '../../constants/i18n';

export default function TabsLayout() {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#56CCF2',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, size }) => <Sun size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: t.tabs.details,
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cities"
        options={{
          title: t.tabs.cities,
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.tabs.settings,
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0A0E14',
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
