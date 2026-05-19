import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function CalendarScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState('PM');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>DATE & PREFERENCES</ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <ThemedText style={[styles.sectionLabel, { color: theme.primary, backgroundColor: theme.backgroundElement }]}>Choose Photoshoot Date</ThemedText>
            <View style={[styles.calendarPlaceholder, { backgroundColor: theme.backgroundElement }]}>
              {/* Simplified Calendar representation */}
              <View style={styles.calendarHeader}>
                <Ionicons name="chevron-back" size={20} color={theme.text} />
                <ThemedText style={styles.calendarMonth}>Sep - 2025</ThemedText>
                <Ionicons name="chevron-forward" size={20} color={theme.text} />
              </View>
              <View style={styles.calendarGrid}>
                {Array.from({ length: 31 }).map((_, i) => (
                  <View key={i} style={[styles.calendarDay, i === 9 && { backgroundColor: theme.text }]}>
                    <ThemedText style={[styles.dayText, i === 9 && { color: theme.background }]}>{i + 1}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionLabel, { color: theme.primary, backgroundColor: theme.backgroundElement }]}>Choose Photoshoot Time</ThemedText>
            <View style={styles.timePickerRow}>
              <View style={[styles.timeInput, { backgroundColor: theme.inputBackground }]}>
                <ThemedText style={styles.timeText}>12</ThemedText>
              </View>
              <ThemedText style={styles.timeSeparator}>:</ThemedText>
              <View style={[styles.timeInput, { backgroundColor: theme.inputBackground }]}>
                <ThemedText style={styles.timeText}>45</ThemedText>
              </View>
              <TouchableOpacity 
                onPress={() => setSelectedTime(selectedTime === 'AM' ? 'PM' : 'AM')}
                style={[styles.timeToggle, { backgroundColor: theme.text }]}
              >
                <ThemedText style={[styles.timeToggleText, { color: theme.background }]}>{selectedTime}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={[styles.bookButton, { backgroundColor: theme.primary }]}>
            <ThemedText style={styles.bookButtonText}>BOOK SESSION</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
  backButton: {
    padding: Spacing.one,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
  },
  section: {
    marginBottom: Spacing.six,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.four,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: Spacing.four,
    textAlign: 'center',
    width: '80%',
  },
  calendarPlaceholder: {
    borderRadius: 16,
    padding: Spacing.four,
    width: '100%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: '700',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  calendarDay: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 12,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  timeInput: {
    width: 60,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: '700',
  },
  timeToggle: {
    width: 60,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeToggleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  bookButton: {
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.four,
    marginBottom: Spacing.six,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
