import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import { usePreferences } from '../store';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onFilterPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  style?: ViewStyle;
  showFilter?: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  onFilterPress,
  onFocus,
  onBlur,
  placeholder,
  style,
  showFilter = false,
  autoFocus = false,
}) => {
  const { t } = useTranslation();
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText('');
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  const containerStyle: ViewStyle = {
    ...styles.container,
    backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
    borderColor: isFocused ? '#D62828' : isDark ? '#424242' : '#E0E0E0',
  };

  const textStyle: TextStyle = {
    ...styles.textInput,
    color: isDark ? '#FFFFFF' : '#212121',
  };

  const placeholderColor = isDark ? '#808080' : '#9E9E9E';

  return (
    <View style={[containerStyle, style]}>
      {/* Search Icon */}
      <Text
        style={[
          styles.searchIcon,
          { color: isFocused ? '#D62828' : placeholderColor },
        ]}
      >
        🔍
      </Text>

      {/* Text Input */}
      <TextInput
        style={textStyle}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmit}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        placeholder={placeholder || t('screens.explore.searchPlaceholder')}
        placeholderTextColor={placeholderColor}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="words"
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          activeOpacity={0.7}
        >
          <Text style={[styles.clearIcon, { color: placeholderColor }]}>✕</Text>
        </TouchableOpacity>
      )}

      {/* Filter Button */}
      {showFilter && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterIcon,
              { color: isDark ? '#FFFFFF' : '#212121' },
            ]}
          >
            ⚙️
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    paddingVertical: 0, // Remove default padding
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
    paddingLeft: 16,
  },
  filterIcon: {
    fontSize: 16,
  },
});

export default SearchBar;
