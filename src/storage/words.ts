import AsyncStorage from '@react-native-async-storage/async-storage';
import { WordCard } from '../types';

const KEY = 'wordflash_words';

export async function getWords(): Promise<WordCard[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveWords(words: WordCard[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(words));
}

export async function addWord(word: string, meaning: string): Promise<WordCard> {
  const words = await getWords();
  const entry: WordCard = {
    id: Date.now().toString(),
    word: word.trim(),
    meaning: meaning.trim(),
    createdAt: Date.now(),
  };
  await saveWords([...words, entry]);
  return entry;
}

export async function updateWord(id: string, word: string, meaning: string): Promise<void> {
  const words = await getWords();
  await saveWords(words.map(w => (w.id === id ? { ...w, word: word.trim(), meaning: meaning.trim() } : w)));
}

export async function deleteWord(id: string): Promise<void> {
  const words = await getWords();
  await saveWords(words.filter(w => w.id !== id));
}
