import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePreferences, useUIStore } from '../store';
import { useFavoritesStore } from '../store/favorites';
import { useSearchHistoryStore } from '../store/searchHistory';
import {
  SearchBar,
  CategoryFilter,
  LocationCard,
  CategoryType,
} from '../components';
import SearchSuggestions from '../components/SearchSuggestions';
import SortModal, { SortOption } from '../components/SortModal';

// Real Turkish locations data
import { mockLocations } from '../data/locations';
import { Location } from '../types';

const ExploreScreen: React.FC = () => {
  const { t } = useTranslation();
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';

  const { setCurrentScreen, setSelectedLocation } = useUIStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { recentSearches, addSearch } = useSearchHistoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [currentSort, setCurrentSort] = useState<SortOption>('rating');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // Enhanced filtering and sorting
  const filteredAndSortedLocations = useMemo(() => {
    let filtered = mockLocations.filter(location => {
      const matchesSearch =
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesCategory =
        selectedCategory === 'all' || location.category.id === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort locations
    switch (currentSort) {
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        filtered = filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'alphabetical':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        break;
      case 'distance':
        // For now, just shuffle the array - later can implement real distance
        filtered = [...filtered].sort(() => Math.random() - 0.5);
        break;
    }

    return filtered.map(location => ({
      ...location,
      isFavorite: isFavorite(location.id),
    }));
  }, [searchQuery, selectedCategory, currentSort, isFavorite]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      addSearch(searchQuery.trim());
    }
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    addSearch(suggestion);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const handleRecentPress = (recent: string) => {
    setSearchQuery(recent);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const handleLocationPress = (locationId: string) => {
    setSelectedLocation(locationId);
    setCurrentScreen('detail');
  };

  const handleFavoriteToggle = (locationId: string) => {
    const location = mockLocations.find(loc => loc.id === locationId);
    if (location) {
      toggleFavorite(location);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const getSortDisplayText = () => {
    switch (currentSort) {
      case 'rating':
        return '⭐ En Yüksek Puan';
      case 'popularity':
        return '🔥 En Popüler';
      case 'alphabetical':
        return '🔤 Alfabetik';
      case 'distance':
        return '📍 En Yakın';
      default:
        return '⭐ En Yüksek Puan';
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#121212' : '#FAFAFA' },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#1A1A1A' : '#FFFFFF'}
      />

      {/* Header */}
      <View style={styles.headerSection}>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? '#FFFFFF' : '#1A1A1A' },
          ]}
        >
          🇹🇷 Türkiye'yi Keşfet
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { color: isDark ? '#B0B0B0' : '#666666' },
          ]}
        >
          {filteredAndSortedLocations.length} lokasyon bulundu
        </Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearchSubmit}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Lokasyon, şehir ara..."
          showFilter={false}
        />

        {/* Search Suggestions */}
        <SearchSuggestions
          query={searchQuery}
          onSuggestionPress={handleSuggestionPress}
          onRecentPress={handleRecentPress}
          recentSearches={recentSearches}
          isVisible={
            isSearchFocused &&
            (searchQuery.length > 0 || recentSearches.length > 0)
          }
        />
      </View>

      {/* Controls Row */}
      <View style={styles.controlsRow}>
        {/* Category Filter */}
        <View style={styles.categorySection}>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </View>

        {/* Sort Button */}
        <TouchableOpacity
          style={[
            styles.sortButton,
            { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' },
          ]}
          onPress={() => setShowSortModal(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.sortButtonText,
              { color: isDark ? '#FFFFFF' : '#212121' },
            ]}
          >
            {getSortDisplayText()}
          </Text>
          <Text style={styles.sortArrow}>⌄</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredAndSortedLocations.length > 0 ? (
          <View style={styles.locationsGrid}>
            {filteredAndSortedLocations.map(location => {
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
                  style={styles.locationCard}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? '#B0B0B0' : '#757575' },
              ]}
            >
              {searchQuery
                ? `"${searchQuery}" için sonuç bulunamadı`
                : 'Lokasyon bulunamadı'}
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { color: isDark ? '#808080' : '#9E9E9E' },
              ]}
            >
              Farklı anahtar kelimeler deneyin
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sort Modal */}
      <SortModal
        isVisible={showSortModal}
        onClose={() => setShowSortModal(false)}
        currentSort={currentSort}
        onSortSelect={setCurrentSort}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
    zIndex: 1000,
  },
  controlsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 12,
  },
  categorySection: {
    flex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  sortArrow: {
    fontSize: 12,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  locationsGrid: {
    paddingHorizontal: 16,
    gap: 16,
  },
  locationCard: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ExploreScreen;
