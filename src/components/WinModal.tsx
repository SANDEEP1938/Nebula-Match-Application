import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { PrimaryButton } from './ui/PrimaryButton';

interface Props {
  visible: boolean;
  score: number;
  moves: number;
  timeSeconds: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const WinModal = ({
  visible,
  score,
  moves,
  timeSeconds,
  onPlayAgain,
  onClose,
}: Props) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.overlay}>
        <Animated.View
          entering={SlideInDown.springify().damping(16)}
          exiting={SlideOutDown}
          style={styles.card}
        >
          <Text style={styles.title}>🌌 Victory!</Text>
          <Text style={styles.subtitle}>You cleared the nebula grid</Text>
          <View style={styles.stats}>
            <Stat label="Score" value={String(score)} highlight />
            <Stat label="Moves" value={String(moves)} />
            <Stat label="Time" value={`${timeSeconds}s`} />
          </View>
          <PrimaryButton label="Play again" onPress={onPlayAgain} />
          <PrimaryButton label="Done" onPress={onClose} variant="ghost" style={styles.gap} />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const Stat = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <View style={styles.stat}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, highlight && styles.statHighlight]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: { alignItems: 'center' },
  statLabel: { color: colors.textMuted, fontSize: 12 },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 4 },
  statHighlight: { color: colors.gold },
  gap: { marginTop: 10 },
});
