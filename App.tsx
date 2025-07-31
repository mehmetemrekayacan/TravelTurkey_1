/**
 * TravelTurkey - Main App Component
 * https://github.com/travelturkey/mobile-app
 *
 * @format
 */

/**
 * TravelTurkey - Main App Component
 * https://github.com/travelturkey/mobile-app
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { TamaguiProvider } from '@tamagui/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Screens
import AppContainer from './src/components/AppContainer';

// Internationalization
import './src/locales/i18n';

// Theme
import travelTurkeyConfig from './src/theme/tamagui.config';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={travelTurkeyConfig}>
        <SafeAreaView style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#f8f9fa"
            translucent={false}
          />
          <AppContainer />
        </SafeAreaView>
      </TamaguiProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default App;
