import React, { useRef, useState } from 'react';
import { Animated, TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.3;

interface Props {
  word: string;
  meaning: string;
  index: number;
  total: number;
}

export default function FlipCard({ word, meaning, index, total }: Props) {
  const [flipped, setFlipped] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const frontRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity = anim.interpolate({ inputRange: [0.4, 0.5], outputRange: [1, 0] });
  const backOpacity = anim.interpolate({ inputRange: [0.4, 0.5], outputRange: [0, 1] });

  function flip() {
    Animated.spring(anim, {
      toValue: flipped ? 0 : 1,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
    setFlipped(f => !f);
  }

  return (
    <TouchableOpacity onPress={flip} activeOpacity={0.95} style={styles.wrapper}>
      {/* Front */}
      <Animated.View
        style={[
          styles.card, styles.front,
          { transform: [{ rotateY: frontRotate }], opacity: frontOpacity },
        ]}
      >
        <Text style={styles.counter}>{index + 1} / {total}</Text>
        <Text style={styles.wordText}>{word}</Text>
        <Text style={styles.hint}>Tap to reveal</Text>
      </Animated.View>

      {/* Back */}
      <Animated.View
        style={[
          styles.card, styles.back,
          { transform: [{ rotateY: backRotate }], opacity: backOpacity },
        ]}
      >
        <Text style={styles.counter}>{index + 1} / {total}</Text>
        <Text style={styles.meaningLabel}>MEANING</Text>
        <Text style={styles.meaningText}>{meaning}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  front: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  back: {
    backgroundColor: '#312E81',
  },
  counter: {
    position: 'absolute',
    top: 20,
    right: 24,
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  wordText: {
    color: '#F8FAFC',
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  hint: {
    position: 'absolute',
    bottom: 28,
    color: '#475569',
    fontSize: 13,
  },
  meaningLabel: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 16,
  },
  meaningText: {
    color: '#E2E8F0',
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 32,
  },
});
