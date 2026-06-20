import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AdminScreen from './src/screens/AdminScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';

export type RootStackParamList = {
  Home: undefined;
  Admin: undefined;
  Flashcards: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0F172A' },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Manage Words' }} />
        <Stack.Screen name="Flashcards" component={FlashcardScreen} options={{ title: 'Study' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
