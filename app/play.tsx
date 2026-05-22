import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import api from '../src/api/client';
import { GameBoard } from '../src/components/GameBoard';
import { WinModal } from '../src/components/WinModal';
import { CosmicBackground } from '../src/components/ui/CosmicBackground';
import { PrimaryButton } from '../src/components/ui/PrimaryButton';
import { useAuth } from '../src/context/AuthContext';
import { useMemoryGame } from '../src/hooks/useMemoryGame';
import { colors } from '../src/theme/colors';
import type { ApiSuccess, Difficulty, User } from '../src/types';

export default function PlayScreen() {
  const params = useLocalSearchParams<{ difficulty?: string }>();
  const difficulty = (params.difficulty as Difficulty) ?? 'easy';
  const { updateUser } = useAuth();
  const { state, handleCardPress, reset } = useMemoryGame(difficulty);
  const [showWin, setShowWin] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const submitWin = useCallback(async () => {
    if (submitting || saved) return;
    setSubmitting(true);
    try {
      const { data } = await api.post<
        ApiSuccess<{
          session: { score: number };
          user: Pick<User, 'gamesPlayed' | 'gamesWon' | 'totalScore' | 'bestScore'>;
        }>
      >('/game/submit', {
        difficulty: state.difficulty,
        moves: state.moves,
        timeSeconds: state.elapsedSeconds,
        pairsFound: state.pairsFound,
        completed: true,
      });
      setFinalScore(data.data.session.score);
      updateUser(data.data.user);
      setSaved(true);
    } catch {
      setFinalScore(0);
    } finally {
      setSubmitting(false);
      setShowWin(true);
    }
  }, [
    state.difficulty,
    state.moves,
    state.elapsedSeconds,
    state.pairsFound,
    submitting,
    saved,
    updateUser,
  ]);

  useEffect(() => {
    if (state.completed && !saved && !submitting) {
      void submitWin();
    }
  }, [state.completed, saved, submitting, submitWin]);

  return (
    <CosmicBackground>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.stats}>
          <Text style={styles.stat}>⏱ {state.elapsedSeconds}s</Text>
          <Text style={styles.stat}>👆 {state.moves} moves</Text>
          <Text style={styles.stat}>
            ✓ {state.pairsFound}/{state.totalPairs}
          </Text>
        </View>
        <GameBoard
          cards={state.cards}
          difficulty={difficulty}
          lockBoard={state.lockBoard}
          onCardPress={handleCardPress}
        />
        <PrimaryButton
          label="Restart"
          variant="ghost"
          onPress={() => {
            setShowWin(false);
            setSaved(false);
            reset();
          }}
          style={styles.restart}
        />
      </ScrollView>
      <WinModal
        visible={showWin}
        score={finalScore}
        moves={state.moves}
        timeSeconds={state.elapsedSeconds}
        onPlayAgain={() => {
          setShowWin(false);
          setSaved(false);
          reset();
        }}
        onClose={() => router.back()}
      />
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40 },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 8,
  },
  stat: { color: colors.text, fontWeight: '600', fontSize: 14 },
  restart: { marginHorizontal: 24, marginTop: 16 },
});
