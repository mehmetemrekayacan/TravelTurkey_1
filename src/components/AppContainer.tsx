import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { useUIStore, usePreferences, useCurrentScreen } from '../store';

// Screens
import ExploreScreen from '../screens/ExploreScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LocationDetailScreen from '../screens/LocationDetailScreen';

// Components
import TabNavigation from './TabNavigation';

const AppContainer: React.FC = () => {
  const currentTab = useUIStore(state => state.currentTab);
  const currentScreen = useCurrentScreen();
  const { setCurrentScreen } = useUIStore();
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';

  const backgroundColor = isDark ? '#000000' : '#F8F9FA';

  // Handle Android back button
  const handleBackPress = useCallback(() => {
    if (currentScreen === 'detail') {
      // If on detail screen, go back to main without clearing selectedLocationId
      setCurrentScreen('main');
      return true; // Prevent default behavior
    }
    // If on main screen, allow app to exit
    return false;
  }, [currentScreen, setCurrentScreen]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  const renderCurrentScreen = () => {
    // If we're on detail screen, show detail screen
    if (currentScreen === 'detail') {
      return <LocationDetailScreen />;
    }

    // Otherwise show tab screens
    switch (currentTab) {
      case 'Explore':
        return <ExploreScreen />;
      case 'Favorites':
        return <FavoritesScreen />;
      case 'Map':
        return <MapScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <ExploreScreen />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Main Content Area */}
      <View style={styles.screenContainer}>{renderCurrentScreen()}</View>

      {/* Tab Navigation - Hide only on detail screen */}
      {currentScreen !== 'detail' && <TabNavigation />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingBottom: 80, // Space for tab navigation
  },
});

export default AppContainer;
