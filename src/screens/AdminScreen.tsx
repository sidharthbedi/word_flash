import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getWords, addWord, updateWord, deleteWord } from '../storage/words';
import { WordCard } from '../types';

export default function AdminScreen() {
  const [words, setWords] = useState<WordCard[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<WordCard | null>(null);
  const [wordInput, setWordInput] = useState('');
  const [meaningInput, setMeaningInput] = useState('');

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function load() {
    setWords(await getWords());
  }

  function openAdd() {
    setEditTarget(null);
    setWordInput('');
    setMeaningInput('');
    setModalVisible(true);
  }

  function openEdit(card: WordCard) {
    setEditTarget(card);
    setWordInput(card.word);
    setMeaningInput(card.meaning);
    setModalVisible(true);
  }

  async function handleSave() {
    if (!wordInput.trim() || !meaningInput.trim()) {
      Alert.alert('Both fields are required');
      return;
    }
    if (editTarget) {
      await updateWord(editTarget.id, wordInput, meaningInput);
    } else {
      await addWord(wordInput, meaningInput);
    }
    setModalVisible(false);
    load();
  }

  async function handleDelete(id: string) {
    Alert.alert('Delete word?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteWord(id);
          load();
        }
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={words}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No words yet. Tap + to add one.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.meaning} numberOfLines={2}>{item.meaning}</Text>
            </View>
            <TouchableOpacity onPress={() => openEdit(item)} style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editTarget ? 'Edit Word' : 'Add Word'}</Text>

            <Text style={styles.label}>Word</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ephemeral"
              placeholderTextColor="#475569"
              value={wordInput}
              onChangeText={setWordInput}
              maxLength={100}
              autoFocus
            />

            <Text style={styles.label}>Meaning</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="e.g. Lasting for a very short time"
              placeholderTextColor="#475569"
              value={meaningInput}
              onChangeText={setMeaningInput}
              maxLength={500}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  list: { padding: 16, paddingBottom: 100 },
  empty: { color: '#475569', textAlign: 'center', marginTop: 60, fontSize: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rowText: { flex: 1 },
  word: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  meaning: { color: '#94A3B8', fontSize: 13, marginTop: 2 },
  editBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  editBtnText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  deleteBtn: {
    backgroundColor: '#450A0A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteBtnText: { color: '#FCA5A5', fontSize: 14, fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 32, right: 24,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#6366F1',
    alignItems: 'center', justifyContent: 'center',
    elevation: 6,
    shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalCard: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '700', marginBottom: 20 },
  label: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputMulti: { height: 90, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#0F172A', alignItems: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  cancelBtnText: { color: '#94A3B8', fontSize: 16, fontWeight: '600' },
  saveBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#6366F1', alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
