import { StyleSheet, View, useWindowDimensions } from 'react-native';
import type { Card } from '../types';
import { DIFFICULTY_GRID } from '../utils/gameLogic';
import type { Difficulty } from '../types';
import { MemoryCard } from './MemoryCard';

interface Props {
  cards: Card[];
  difficulty: Difficulty;
  lockBoard: boolean;
  onCardPress: (index: number) => void;
}

export const GameBoard = ({ cards, difficulty, lockBoard, onCardPress }: Props) => {
  const { width } = useWindowDimensions();
  const cols = DIFFICULTY_GRID[difficulty].cols;
  const gap = 8;
  const horizontalPad = 24;
  const cardWidth = (width - horizontalPad * 2 - gap * (cols - 1)) / cols;

  return (
    <View style={[styles.board, { gap }]}>
      {cards.map((card, index) => (
        <MemoryCard
          key={card.id}
          card={card}
          size={cardWidth}
          disabled={lockBoard}
          onPress={() => onCardPress(index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
