import React from 'react';
import { View, StyleSheet } from 'react-native';
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
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';

  const backgroundColor = isDark ? '#000000' : '#F8F9FA';

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

      {/* Tab Navigation - Hide on detail screen */}
      {currentScreen === 'main' && <TabNavigation />}
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
