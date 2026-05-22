import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import type { Card } from '../types';
import { colors } from '../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  card: Card;
  disabled: boolean;
  onPress: () => void;
  size: number;
}

export const MemoryCard = ({ card, disabled, onPress, size }: Props) => {
  const flip = useSharedValue(card.flipped || card.matched ? 1 : 0);
  const matchGlow = useSharedValue(card.matched ? 1 : 0);

  useEffect(() => {
    flip.value = withSpring(card.flipped || card.matched ? 1 : 0, {
      damping: 14,
      stiffness: 120,
    });
    if (card.matched) {
      matchGlow.value = withTiming(1, { duration: 400 });
    }
  }, [card.flipped, card.matched, flip, matchGlow]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` },
    ],
    opacity: flip.value < 0.5 ? 1 : 0,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` },
    ],
    opacity: flip.value > 0.5 ? 1 : 0,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: matchGlow.value * 0.8,
    borderColor: matchGlow.value > 0.5 ? colors.success : colors.border,
  }));

  return (
    <AnimatedPressable
      disabled={disabled || card.matched}
      onPress={onPress}
      style={[styles.wrapper, { width: size, height: size * 1.2 }, glowStyle]}
    >
      <Animated.View style={[styles.face, styles.back, frontStyle]}>
        <Text style={styles.nebula}>✦</Text>
      </Animated.View>
      <Animated.View style={[styles.face, styles.front, backStyle]}>
        <Text style={styles.symbol}>{card.symbol}</Text>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.success,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  back: {
    backgroundColor: colors.bgElevated,
  },
  front: {
    backgroundColor: colors.bgCard,
  },
  nebula: {
    fontSize: 28,
    color: colors.accentGlow,
  },
  symbol: {
    fontSize: 32,
  },
});
