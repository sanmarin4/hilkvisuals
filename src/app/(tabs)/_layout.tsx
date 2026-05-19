import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: '#1E1E1E', // Dark background for tabs as seen in Figma
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
        },
        tabBarShowLabel: false, // Figma doesn't show labels in the tab bar
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size + 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size + 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size + 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size + 4} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
