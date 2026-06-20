import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>WordFlash</Text>
      <Text style={styles.subtitle}>Build your vocabulary</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Flashcards')}>
        <Text style={styles.primaryBtnText}>Study Cards</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Admin')}>
        <Text style={styles.secondaryBtnText}>Manage Words</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 64,
  },
  primaryBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryBtnText: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '600',
  },
});
