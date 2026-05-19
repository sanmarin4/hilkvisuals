import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthLogo } from '@/components/auth-logo';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/auth-context';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate a login delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      await signIn(email);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <AuthLogo size="small" />

          <View style={styles.headerContainer}>
            <ThemedText type="subtitle" style={styles.title}>LOGIN</ThemedText>
            <ThemedText type="small" style={styles.subtitle}>Please sign in to continue</ThemedText>
          </View>

          <View style={styles.form}>
            <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
              <Ionicons name="mail" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                placeholder="EMAIL"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text }]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
              <Ionicons name="lock-closed" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                placeholder="PASSWORD"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              <Pressable 
                style={styles.rememberMe} 
                onPress={() => setRememberMe(!rememberMe)}
              >
                <ThemedText type="small" style={styles.rememberMeText}>Remember me?</ThemedText>
                <View style={[
                  styles.checkbox, 
                  { borderColor: theme.textSecondary },
                  rememberMe && { backgroundColor: theme.text, borderColor: theme.text }
                ]}>
                  {rememberMe && <Ionicons name="checkmark" size={12} color={theme.background} />}
                </View>
              </Pressable>
            </View>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <ThemedText style={styles.buttonText}>SIGN IN</ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <ThemedText type="small">Don't have account? </ThemedText>
              <Link href="/auth/register" asChild>
                <TouchableOpacity>
                  <ThemedText type="smallBold" style={{ color: theme.primary }}>SIGN UP</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: Spacing.one,
    opacity: 0.7,
  },
  form: {
    gap: Spacing.three,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rememberMeText: {
    fontSize: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
});
