import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { colors } from '../../theme/colors';

export const CosmicBackground = ({ children }: { children: ReactNode }) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulse]);

  const orbStyle = useAnimatedStyle(() => ({
    opacity: 0.15 + pulse.value * 0.2,
    transform: [{ scale: 0.9 + pulse.value * 0.15 }],
  }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0b0f1f', '#141b33', '#0b0f1f']}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.orb, styles.orbPurple, orbStyle]} />
      <Animated.View style={[styles.orb, styles.orbCyan, orbStyle]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  orb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  orbPurple: {
    top: 80,
    right: -40,
    backgroundColor: colors.accent,
  },
  orbCyan: {
    bottom: 120,
    left: -60,
    backgroundColor: colors.cyan,
  },
});
