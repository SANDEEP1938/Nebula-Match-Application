import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import api from '../../src/api/client';
import { CosmicBackground } from '../../src/components/ui/CosmicBackground';
import { colors } from '../../src/theme/colors';
import type { ApiSuccess, Difficulty, LeaderboardEntry, RecentWin } from '../../src/types';

export default function LeaderboardScreen() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [recent, setRecent] = useState<RecentWin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [boardRes, recentRes] = await Promise.all([
        api.get<ApiSuccess<{ entries: LeaderboardEntry[] }>>('/leaderboard', {
          params: { difficulty },
        }),
        api.get<ApiSuccess<{ wins: RecentWin[] }>>('/leaderboard/recent'),
      ]);
      setEntries(boardRes.data.data.entries);
      setRecent(recentRes.data.data.wins);
    } catch {
      setError('Could not load leaderboard. Check API URL in .env');
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    void load();
  }, [load]);

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <CosmicBackground>
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.accent} />}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.filters}>
          {difficulties.map((d) => (
            <Text
              key={d}
              onPress={() => {
                setDifficulty(d);
                void load();
              }}
              style={[styles.chip, difficulty === d && styles.chipActive]}
            >
              {d}
            </Text>
          ))}
        </View>
        {loading && <ActivityIndicator color={colors.accent} style={styles.loader} />}
        {error && <Text style={styles.error}>{error}</Text>}
        {!loading &&
          entries.map((entry, i) => (
            <Animated.View
              key={entry.userId}
              entering={FadeInRight.delay(i * 50).duration(300)}
              style={styles.row}
            >
              <Text style={styles.rank}>#{entry.rank}</Text>
              <View style={styles.rowBody}>
                <Text style={styles.name}>{entry.username}</Text>
                <Text style={styles.meta}>
                  {entry.bestScore} pts · {entry.bestMoves} moves · {entry.bestTime}s
                </Text>
              </View>
            </Animated.View>
          ))}
        <Text style={styles.section}>Recent wins</Text>
        {recent.map((win, i) => (
          <Animated.View
            key={win.id}
            entering={FadeInRight.delay(i * 40).duration(280)}
            style={styles.recent}
          >
            <Text style={styles.name}>{win.username}</Text>
            <Text style={styles.meta}>
              {win.difficulty} · {win.score} pts · {win.moves} moves
            </Text>
          </Animated.View>
        ))}
      </ScrollView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  chip: {
    color: colors.textMuted,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    textTransform: 'capitalize',
  },
  chipActive: {
    color: colors.text,
    borderColor: colors.accent,
    backgroundColor: colors.bgElevated,
  },
  loader: { marginVertical: 24 },
  error: { color: colors.danger, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rank: { color: colors.gold, fontWeight: '800', width: 36, fontSize: 16 },
  rowBody: { flex: 1 },
  name: { color: colors.text, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  recent: {
    backgroundColor: colors.bgElevated,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
});
