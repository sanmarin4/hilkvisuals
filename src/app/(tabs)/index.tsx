import React from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/auth-context';

export default function HomeScreen() {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText style={styles.welcomeText}>
            WELCOME, {user?.fullName?.toUpperCase() || 'USER'}!
          </ThemedText>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.inputBackground }]}>
            <Ionicons name="notifications-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <ThemedText style={styles.sectionTitle}>Book Photoshoots</ThemedText>
            
            <View style={styles.grid}>
              {[1, 2, 3, 4].map((item) => (
                <View key={item} style={styles.gridItem}>
                  <Image 
                    source={{ uri: `https://picsum.photos/seed/${item + 10}/300/400` }} 
                    style={styles.image}
                  />
                </View>
              ))}
            </View>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: Spacing.four,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.four,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    aspectRatio: 0.75,
    marginBottom: Spacing.four,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
});
