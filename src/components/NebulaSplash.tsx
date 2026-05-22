import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

interface Props {
  visible: boolean;
}

const Star = ({
  left,
  top,
  size,
  delay,
}: {
  left: `${number}%`;
  top: number;
  size: number;
  delay: number;
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.25, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        style,
        { left, top, width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
};

export const NebulaSplash = ({ visible }: Props) => {
  const emblemScale = useSharedValue(0.9);
  const emblemGlow = useSharedValue(0.5);

  useEffect(() => {
    emblemScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.94, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    emblemGlow.value = withRepeat(
      withSequence(withTiming(1, { duration: 1800 }), withTiming(0.45, { duration: 1800 })),
      -1,
      true
    );
  }, [emblemGlow, emblemScale]);

  const emblemStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emblemScale.value }],
    shadowOpacity: emblemGlow.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(300)} style={styles.overlay}>
      <LinearGradient
        colors={['#0b0f1f', '#1a1040', '#0b1f33', '#0b0f1f']}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, styles.orbPurple]} />
      <View style={[styles.orb, styles.orbCyan]} />

      <Star left="12%" top={90} size={3} delay={0} />
      <Star left="78%" top={120} size={4} delay={200} />
      <Star left="22%" top={200} size={2} delay={400} />
      <Star left="65%" top={260} size={3} delay={600} />
      <Star left="88%" top={340} size={2} delay={100} />

      <View style={styles.content}>
        <Animated.View style={[styles.emblemWrap, emblemStyle]}>
          <LinearGradient colors={[colors.accentGlow, colors.accent, '#4c1d95']} style={styles.emblem}>
            <Text style={styles.emblemIcon}>✦</Text>
          </LinearGradient>
        </Animated.View>
        <Text style={styles.title}>NEBULA MATCH</Text>
        <Text style={styles.tagline}>Flip the cosmos</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: colors.bg,
  },
  orb: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.25,
  },
  orbPurple: {
    top: -80,
    left: -100,
    backgroundColor: colors.accent,
  },
  orbCyan: {
    bottom: 0,
    right: -120,
    backgroundColor: colors.cyan,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emblemWrap: {
    shadowColor: colors.accentGlow,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 28,
  },
  emblem: {
    width: 112,
    height: 112,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
  },
  emblemIcon: {
    fontSize: 52,
    color: '#fff',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 17,
    marginTop: 10,
  },
});
