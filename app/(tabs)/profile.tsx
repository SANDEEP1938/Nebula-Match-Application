import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import api from '../../src/api/client';
import { CosmicBackground } from '../../src/components/ui/CosmicBackground';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/theme/colors';
import type { ApiSuccess, DifficultyStats, GameSessionSummary } from '../../src/types';

export default function ProfileScreen() {
  const { user, logout, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<GameSessionSummary[]>([]);
  const [stats, setStats] = useState<DifficultyStats[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [historyRes, statsRes] = await Promise.all([
          api.get<ApiSuccess<{ sessions: GameSessionSummary[] }>>('/game/history'),
          api.get<ApiSuccess<{ byDifficulty: DifficultyStats[] }>>('/game/stats'),
        ]);
        setHistory(historyRes.data.data.sessions);
        setStats(statsRes.data.data.byDifficulty);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [user]);

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!user) {
    return (
      <CosmicBackground>
        <View style={styles.guest}>
          <Text style={styles.title}>Pilot Profile</Text>
          <Text style={styles.subtitle}>Sign in to track scores and history.</Text>
          <PrimaryButton label="Sign in" onPress={() => router.push('/login')} />
          <PrimaryButton
            label="Register"
            variant="ghost"
            onPress={() => router.push('/register')}
            style={styles.gap}
          />
        </View>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInUp.duration(400)}>
          <Text style={styles.title}>Pilot Profile</Text>
          <View style={styles.grid}>
            <StatCard label="Username" value={user.username} />
            <StatCard label="Games" value={String(user.gamesPlayed)} />
            <StatCard label="Wins" value={String(user.gamesWon)} />
            <StatCard label="Best score" value={String(user.bestScore)} highlight />
            <StatCard label="Total score" value={String(user.totalScore)} />
          </View>
        </Animated.View>
        {loading && <ActivityIndicator color={colors.accent} />}
        {stats.length > 0 && (
          <>
            <Text style={styles.section}>By difficulty</Text>
            {stats.map((row, i) => (
              <Animated.View
                key={row.difficulty}
                entering={FadeInUp.delay(i * 60).duration(300)}
                style={styles.card}
              >
                <Text style={styles.cardTitle}>{row.difficulty}</Text>
                <Text style={styles.cardMeta}>
                  {row.games} games · {row.wins} wins · best {row.bestScore}
                </Text>
              </Animated.View>
            ))}
          </>
        )}
        <Text style={styles.section}>Recent missions</Text>
        {history.slice(0, 10).map((session, i) => (
          <View key={session.id} style={styles.card}>
            <Text style={styles.cardTitle}>{session.difficulty}</Text>
            <Text style={styles.cardMeta}>
              {session.score} pts · {session.moves} moves · {session.timeSeconds}s
            </Text>
          </View>
        ))}
        <PrimaryButton
          label="Sign out"
          variant="danger"
          onPress={async () => {
            await logout();
            router.replace('/(tabs)');
          }}
          style={styles.logout}
        />
      </ScrollView>
    </CosmicBackground>
  );
}

const StatCard = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, highlight && styles.highlight]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 48 },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guest: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 16 },
  subtitle: { color: colors.textMuted, marginBottom: 24, fontSize: 16 },
  gap: { marginTop: 10 },
  grid: { gap: 10, marginBottom: 20 },
  statCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: { color: colors.textMuted, fontSize: 12 },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 4 },
  highlight: { color: colors.gold },
  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  cardTitle: { color: colors.text, fontWeight: '700', textTransform: 'capitalize' },
  cardMeta: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  logout: { marginTop: 24 },
});
