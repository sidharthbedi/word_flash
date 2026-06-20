import React, { useCallback, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Animated, PanResponder, Dimensions, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getWords } from '../storage/words';
import { WordCard } from '../types';
import FlipCard from '../components/FlipCard';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardScreen() {
  const [words, setWords] = useState<WordCard[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [cardKey, setCardKey] = useState(0); // force remount on swipe to reset flip

  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function load() {
    setLoading(true);
    const all = await getWords();
    setWords(shuffle(all));
    setIndex(0);
    setDone(false);
    setLoading(false);
    position.setValue({ x: 0, y: 0 });
    opacity.setValue(1);
  }

  function animateOut(direction: 'left' | 'right', onDone: () => void) {
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: direction === 'right' ? width * 1.2 : -width * 1.2, y: 0 },
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      position.setValue({ x: 0, y: 0 });
      opacity.setValue(1);
      onDone();
    });
  }

  function advance(direction: 'left' | 'right') {
    animateOut(direction, () => {
      setIndex(i => {
        const next = i + 1;
        if (next >= words.length) { setDone(true); return i; }
        setCardKey(k => k + 1);
        return next;
      });
    });
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderMove: Animated.event([null, { dx: position.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          advance('right');
        } else if (g.dx < -SWIPE_THRESHOLD) {
          advance('left');
        } else {
          Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color="#6366F1" size="large" />
      </SafeAreaView>
    );
  }

  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyIcon}>📚</Text>
        <Text style={styles.emptyTitle}>No words yet</Text>
        <Text style={styles.emptySubtitle}>Go to Manage Words to add some.</Text>
      </SafeAreaView>
    );
  }

  if (done) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.doneIcon}>🎉</Text>
        <Text style={styles.doneTitle}>All done!</Text>
        <Text style={styles.doneSubtitle}>You reviewed all {words.length} words.</Text>
        <TouchableOpacity style={styles.againBtn} onPress={load}>
          <Text style={styles.againBtnText}>Shuffle & Restart</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.swipeHint}>← Swipe to skip →</Text>

      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [
              { translateX: position.x },
              { rotate },
            ],
            opacity,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <FlipCard
          key={cardKey}
          word={words[index].word}
          meaning={words[index].meaning}
          index={index}
          total={words.length}
        />
      </Animated.View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={() => advance('left')}>
          <Text style={styles.navBtnText}>← Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtnPrimary} onPress={() => advance('right')}>
          <Text style={styles.navBtnPrimaryText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', padding: 32 },
  swipeHint: { color: '#334155', fontSize: 13, marginBottom: 24 },
  cardWrapper: { alignItems: 'center' },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 32, paddingHorizontal: 24 },
  navBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: '#1E293B', alignItems: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  navBtnText: { color: '#94A3B8', fontSize: 16, fontWeight: '600' },
  navBtnPrimary: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: '#6366F1', alignItems: 'center',
  },
  navBtnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { color: '#475569', fontSize: 15, textAlign: 'center' },
  doneIcon: { fontSize: 56, marginBottom: 16 },
  doneTitle: { color: '#F8FAFC', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  doneSubtitle: { color: '#94A3B8', fontSize: 16, marginBottom: 40 },
  againBtn: { backgroundColor: '#6366F1', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 14 },
  againBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
