import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/auth-context';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace('/auth');
  };

  const ProfileButton = ({ label, onPress, isDestructive = false }: { label: string, onPress?: () => void, isDestructive?: boolean }) => (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.profileButton, { backgroundColor: theme.inputBackground }]}
    >
      <ThemedText style={[styles.buttonText, isDestructive && { color: '#F44336' }]}>{label}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="person-outline" size={80} color={theme.textSecondary} />
            </View>
            <ThemedText style={styles.userName}>{user?.fullName || 'FIONA LUZADAS'}</ThemedText>
          </View>

          <View style={styles.buttonGroup}>
            <ProfileButton label="EDIT PROFILE" />
            <ProfileButton label="SETTINGS" />
            <ProfileButton label="ABOUT US" />
            <ProfileButton label="LOGOUT" isDestructive onPress={handleLogout} />
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
  content: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonGroup: {
    width: '100%',
    gap: Spacing.three,
  },
  profileButton: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
