import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CosmicBackground } from '../../src/components/ui/CosmicBackground';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/theme/colors';
import type { Difficulty } from '../../src/types';

const difficulties: { key: Difficulty; label: string; desc: string }[] = [
  { key: 'easy', label: 'Easy', desc: '6 pairs · 3 columns' },
  { key: 'medium', label: 'Medium', desc: '8 pairs · 4 columns' },
  { key: 'hard', label: 'Hard', desc: '10 pairs · 5 columns' },
];

export default function HomeScreen() {
  const { user } = useAuth();

  const startGame = (difficulty: Difficulty) => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push({ pathname: '/play', params: { difficulty } });
  };

  return (
    <CosmicBackground>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.hero}>
          <Text style={styles.badge}>NEBULA MATCH</Text>
          <Text style={styles.title}>Flip the cosmos</Text>
          <Text style={styles.subtitle}>
            Match cosmic symbols, beat your time, climb the leaderboard.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(500)}>
          <Text style={styles.section}>Choose difficulty</Text>
          {difficulties.map((d, i) => (
            <Animated.View
              key={d.key}
              entering={FadeInDown.delay(180 + i * 80).duration(400)}
            >
              <PrimaryButton
                label={`${d.label} — ${d.desc}`}
                onPress={() => startGame(d.key)}
                style={styles.diffBtn}
              />
            </Animated.View>
          ))}
        </Animated.View>

        {!user && (
          <View style={styles.authRow}>
            <PrimaryButton label="Sign in" onPress={() => router.push('/login')} />
            <PrimaryButton
              label="Register"
              variant="ghost"
              onPress={() => router.push('/register')}
              style={styles.authGap}
            />
          </View>
        )}
      </ScrollView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 48 },
  hero: { marginBottom: 28 },
  badge: {
    color: colors.accentGlow,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    marginTop: 10,
    lineHeight: 24,
  },
  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  diffBtn: { marginBottom: 10 },
  authRow: { marginTop: 32 },
  authGap: { marginTop: 10 },
});
