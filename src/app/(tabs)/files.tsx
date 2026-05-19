import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function FilesScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>VIEW FILES</ThemedText>
        </View>

        <View style={styles.content}>
          <View style={[styles.searchBar, { backgroundColor: theme.inputBackground }]}>
            <Ionicons name="search-outline" size={20} color={theme.textSecondary} style={styles.searchIcon} />
            <TextInput
              placeholder="Search in File"
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>

          <View style={styles.tableHeader}>
            <ThemedText style={styles.headerLabel}>Name</ThemedText>
          </View>

          <View style={[styles.folderItem, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="folder-outline" size={32} color={theme.text} />
            <ThemedText style={styles.folderName}>BIRTHDAY SHOOT</ThemedText>
          </View>
        </View>
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
  searchBar: {
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.six,
  },
  searchIcon: {
    marginRight: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  tableHeader: {
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: Spacing.four,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.8,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: 12,
    gap: Spacing.four,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
