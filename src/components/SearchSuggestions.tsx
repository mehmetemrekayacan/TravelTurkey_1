import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { usePreferences } from '../store';
import { mockLocations } from '../data/locations';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionPress: (suggestion: string) => void;
  onRecentPress: (recent: string) => void;
  recentSearches: string[];
  isVisible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSuggestionPress,
  onRecentPress,
  recentSearches,
  isVisible,
}) => {
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';

  if (!isVisible) return null;

  // Generate suggestions based on query
  const suggestions =
    query.length > 0
      ? mockLocations
          .filter(
            location =>
              location.name.toLowerCase().includes(query.toLowerCase()) ||
              location.city.toLowerCase().includes(query.toLowerCase()) ||
              location.region.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 5)
          .map(location => ({
            text: location.name,
            subtext: `${location.city}, ${location.region}`,
            type: 'location' as const,
          }))
      : [];

  // Add city and region suggestions
  const citySuggestions =
    query.length > 0
      ? [
          ...new Set(
            mockLocations
              .filter(location =>
                location.city.toLowerCase().includes(query.toLowerCase()),
              )
              .map(location => location.city),
          ),
        ]
          .slice(0, 3)
          .map(city => ({
            text: city,
            subtext: 'Şehir',
            type: 'city' as const,
          }))
      : [];

  const allSuggestions = [...suggestions, ...citySuggestions];

  const containerStyle = {
    backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF',
    borderColor: isDark ? '#424242' : '#E0E0E0',
  };

  const textColor = isDark ? '#FFFFFF' : '#212121';
  const subtextColor = isDark ? '#B0B0B0' : '#666666';

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recent Searches */}
        {query.length === 0 && recentSearches.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              🕒 Son Aramalar
            </Text>
            {recentSearches.slice(0, 5).map((recent, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => onRecentPress(recent)}
                activeOpacity={0.7}
              >
                <Text style={styles.recentIcon}>🕒</Text>
                <Text style={[styles.suggestionText, { color: textColor }]}>
                  {recent}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Suggestions */}
        {allSuggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              💡 Öneriler
            </Text>
            {allSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => onSuggestionPress(suggestion.text)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionIcon}>
                  {suggestion.type === 'location' ? '📍' : '🏙️'}
                </Text>
                <View style={styles.suggestionContent}>
                  <Text style={[styles.suggestionText, { color: textColor }]}>
                    {suggestion.text}
                  </Text>
                  <Text
                    style={[styles.suggestionSubtext, { color: subtextColor }]}
                  >
                    {suggestion.subtext}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No Results */}
        {query.length > 0 && allSuggestions.length === 0 && (
          <View style={styles.section}>
            <Text style={[styles.noResults, { color: subtextColor }]}>
              "{query}" için sonuç bulunamadı
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  recentIcon: {
    fontSize: 14,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  suggestionSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
});

export default SearchSuggestions;
