import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePreferences, useUIStore } from '../store';
import { useFavoritesStore } from '../store/favorites';
import { LocationCard } from '../components';

const FavoritesScreen: React.FC = () => {
  const { t } = useTranslation();
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';

  const { setCurrentScreen, setSelectedLocation } = useUIStore();
  const { favoriteLocations, toggleFavorite, isFavorite } = useFavoritesStore();

  const handleLocationPress = (locationId: string) => {
    setSelectedLocation(locationId);
    setCurrentScreen('detail');
  };

  const handleFavoriteToggle = (locationId: string) => {
    const location = favoriteLocations.find(loc => loc.id === locationId);
    if (location) {
      toggleFavorite(location);
    }
  };

  const containerStyle = {
    backgroundColor: isDark ? '#000000' : '#F8F9FA',
  };

  const textStyle = {
    color: isDark ? '#FFFFFF' : '#000000',
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={[styles.title, textStyle]}>
          {t('screens.favorites.title')}
        </Text>
        <Text style={[styles.subtitle, textStyle]}>
          {favoriteLocations.length > 0
            ? t('screens.favorites.count', { count: favoriteLocations.length })
            : t('screens.favorites.empty')}
        </Text>
      </View>

      {favoriteLocations.length > 0 ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {favoriteLocations.map(location => {
            // Favori durumunu store'dan al
            const locationWithFavorite = {
              ...location,
              isFavorite: isFavorite(location.id),
            };

            return (
              <LocationCard
                key={location.id}
                location={locationWithFavorite}
                onPress={() => handleLocationPress(location.id)}
                onFavoritePress={() => handleFavoriteToggle(location.id)}
              />
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon]}>❤️</Text>
          <Text style={[styles.emptyTitle, textStyle]}>
            {t('screens.favorites.emptyTitle')}
          </Text>
          <Text style={[styles.emptyMessage, textStyle]}>
            {t('screens.favorites.emptyMessage')}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
});

export default FavoritesScreen;
