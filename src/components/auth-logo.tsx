import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function AuthLogo({ size = 'large' }: { size?: 'small' | 'large' }) {
  const theme = useTheme();
  const isLarge = size === 'large';

  return (
    <View style={styles.container}>
      <View style={[styles.logoWrapper, !isLarge && styles.logoWrapperSmall]}>
        <ThemedText style={[styles.bracket, !isLarge && styles.bracketSmall]}>[</ThemedText>
        <View style={[
          styles.circle, 
          { borderColor: theme.text },
          !isLarge && styles.circleSmall
        ]}>
          <ThemedText style={[styles.hvText, !isLarge && styles.hvTextSmall]}>HV</ThemedText>
        </View>
        <ThemedText style={[styles.bracket, !isLarge && styles.bracketSmall]}>]</ThemedText>
        
        {/* Simple Camera Lens representation at the top of the left bracket */}
        <View style={[styles.cameraLens, { backgroundColor: theme.text }, !isLarge && styles.cameraLensSmall]} />
      </View>
      <View style={[styles.textWrapper, !isLarge && styles.textWrapperSmall]}>
        {"HilkVisuals".split("").map((char, index) => (
          <ThemedText
            key={index}
            style={[
              styles.logoText,
              !isLarge && styles.logoTextSmall,
              (char === 'H' || char === 'V') && { color: theme.primary }
            ]}
          >
            {char}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 10,
  },
  logoWrapperSmall: {
    paddingTop: 5,
  },
  cameraLens: {
    position: 'absolute',
    top: 0,
    left: '35%',
    width: 15,
    height: 6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  cameraLensSmall: {
    width: 10,
    height: 4,
  },
  bracket: {
    fontSize: 80,
    fontWeight: '200',
    lineHeight: 90,
  },
  bracketSmall: {
    fontSize: 40,
    lineHeight: 45,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.two,
  },
  circleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    marginHorizontal: Spacing.one,
  },
  hvText: {
    fontSize: 28,
    fontWeight: '900',
  },
  hvTextSmall: {
    fontSize: 14,
    fontWeight: '900',
  },
  textWrapper: {
    flexDirection: 'row',
    marginTop: -Spacing.two,
    paddingLeft: 10,
  },
  textWrapperSmall: {
    marginTop: -Spacing.one,
    paddingLeft: 5,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 6,
  },
  logoTextSmall: {
    fontSize: 10,
    letterSpacing: 3,
  },
});
