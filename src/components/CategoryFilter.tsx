import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { usePreferences } from '../store';
import { useTranslation } from 'react-i18next';

export type CategoryType =
  | 'all'
  | 'historical'
  | 'natural'
  | 'cultural'
  | 'religious'
  | 'adventure'
  | 'beach'
  | 'museum'
  | 'restaurant'
  | 'shopping';

interface Category {
  id: CategoryType;
  titleKey: string;
  emoji: string;
}

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  onCategorySelect: (category: CategoryType) => void;
  style?: ViewStyle;
  horizontal?: boolean;
}

const CATEGORIES: Category[] = [
  { id: 'all', titleKey: 'categories.all', emoji: '🔥' },
  { id: 'historical', titleKey: 'categories.historical', emoji: '🏛️' },
  { id: 'natural', titleKey: 'categories.natural', emoji: '🏞️' },
  { id: 'cultural', titleKey: 'categories.cultural', emoji: '🎭' },
  { id: 'religious', titleKey: 'categories.religious', emoji: '🕌' },
  { id: 'adventure', titleKey: 'categories.adventure', emoji: '⛰️' },
  { id: 'beach', titleKey: 'categories.beach', emoji: '🏖️' },
  { id: 'museum', titleKey: 'categories.museum', emoji: '🏛️' },
  { id: 'restaurant', titleKey: 'categories.restaurant', emoji: '🍽️' },
  { id: 'shopping', titleKey: 'categories.shopping', emoji: '🛍️' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategorySelect,
  style,
  horizontal = true,
}) => {
  const { t } = useTranslation();
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';

  const renderCategory = (category: Category) => {
    const isSelected = selectedCategory === category.id;

    const buttonStyle = {
      ...styles.categoryButton,
      backgroundColor: isSelected ? '#D62828' : isDark ? '#2C2C2C' : '#F5F5F5',
      borderColor: isSelected ? '#D62828' : isDark ? '#424242' : '#E0E0E0',
    };

    const textStyle = {
      ...styles.categoryText,
      color: isSelected ? '#FFFFFF' : isDark ? '#FFFFFF' : '#212121',
    };

    const iconColor = isSelected ? '#FFFFFF' : isDark ? '#FFFFFF' : '#212121';

    return (
      <TouchableOpacity
        key={category.id}
        style={buttonStyle}
        onPress={() => onCategorySelect(category.id)}
        activeOpacity={0.8}
      >
        <Text style={[styles.categoryIcon, { color: iconColor }]}>
          {category.emoji}
        </Text>
        <Text style={textStyle}>{t(category.titleKey)}</Text>
      </TouchableOpacity>
    );
  };

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.horizontalContainer, style]}
        style={styles.scrollView}
      >
        {CATEGORIES.map(renderCategory)}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.verticalContainer, style]}>
      {CATEGORIES.map(renderCategory)}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  horizontalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  verticalContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 40,
  },
  categoryIcon: {
    marginRight: 6,
    fontSize: 18,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CategoryFilter;
