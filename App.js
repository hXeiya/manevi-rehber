import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from './src/components/ErrorBoundary';
import { AppProvider, useApp } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import ConfettiEffect from './src/components/ConfettiEffect';

function MainAppContent() {
  const { isConfettiActive, setIsConfettiActive } = useApp();

  return (
    <>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
      <ConfettiEffect
        active={isConfettiActive}
        onComplete={() => setIsConfettiActive(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AppProvider>
          <MainAppContent />
        </AppProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
