import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { usePreferences } from '../store';
import { Location } from '../types';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');

interface LocationCardProps {
  location: Location;
  onPress: () => void;
  onFavoritePress: () => void;
  variant?: 'standard' | 'featured' | 'compact';
  style?: ViewStyle;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onPress,
  onFavoritePress,
  variant = 'standard',
  style,
}) => {
  const { t } = useTranslation();
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';
  const isCurrentLanguage = preferences.language;

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF',
      borderRadius: 16,
      shadowColor: isDark ? '#000000CC' : '#0000001A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      marginVertical: 8,
    };

    switch (variant) {
      case 'featured':
        baseStyle.width = screenWidth - 40;
        baseStyle.marginHorizontal = 8;
        break;
      case 'compact':
        baseStyle.width = screenWidth * 0.7;
        baseStyle.marginHorizontal = 8;
        break;
      default: // standard
        baseStyle.marginHorizontal = 20;
    }

    return baseStyle;
  };

  const getImageHeight = (): number => {
    switch (variant) {
      case 'featured':
        return 220;
      case 'compact':
        return 140;
      default:
        return 180;
    }
  };

  const displayName =
    isCurrentLanguage === 'en'
      ? location.nameEn || location.name
      : location.name;
  const displayDescription =
    isCurrentLanguage === 'en'
      ? location.descriptionEn || location.description
      : location.description;
  const displayCity =
    isCurrentLanguage === 'en'
      ? location.cityEn || location.city
      : location.city;

  const themeStyles = {
    title: {
      color: isDark ? '#FFFFFF' : '#212121',
    },
    text: {
      color: isDark ? '#B0B0B0' : '#757575',
    },
    lightText: {
      color: isDark ? '#808080' : '#9E9E9E',
    },
  };

  return (
    <TouchableOpacity
      style={[getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: location.images[0] || 'https://via.placeholder.com/300x200',
          }}
          style={[styles.image, { height: getImageHeight() }]}
          resizeMode="cover"
        />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}
        >
          <Text style={styles.favoriteIcon}>
            {location.isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>

        {/* Category Badge */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: location.category.color || '#D62828' },
          ]}
        >
          <Text style={styles.categoryText}>
            {isCurrentLanguage === 'en'
              ? location.category.nameEn
              : location.category.name}
          </Text>
        </View>
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Title and Location */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, themeStyles.title]} numberOfLines={1}>
            {displayName}
          </Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={[styles.location, themeStyles.text]} numberOfLines={1}>
              {displayCity}
            </Text>
          </View>
        </View>

        {/* Description */}
        {variant !== 'compact' && (
          <Text
            style={[styles.description, themeStyles.text]}
            numberOfLines={2}
          >
            {displayDescription}
          </Text>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {/* Rating */}
          <View style={styles.statItem}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={[styles.statText, themeStyles.text]}>
              {location.rating.toFixed(1)}
            </Text>
            <Text style={[styles.statText, themeStyles.lightText]}>
              ({location.reviewCount})
            </Text>
          </View>

          {/* Visit Duration */}
          <View style={styles.statItem}>
            <Text style={styles.scheduleIcon}>🕒</Text>
            <Text style={[styles.statText, themeStyles.text]}>
              {location.visitDuration > 60
                ? `${Math.floor(location.visitDuration / 60)}h ${
                    location.visitDuration % 60
                  }m`
                : `${location.visitDuration}m`}
            </Text>
          </View>

          {/* Entry Fee */}
          <View style={styles.statItem}>
            <Text style={styles.feeIcon}>
              {location.entryFee.adult > 0 ? '💰' : '🆓'}
            </Text>
            <Text style={[styles.statText, themeStyles.text]}>
              {location.entryFee.adult > 0
                ? `${location.entryFee.adult} TL`
                : t('screens.locationDetail.free')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  image: {
    width: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 6,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  locationIcon: {
    fontSize: 14,
  },
  starIcon: {
    fontSize: 16,
  },
  scheduleIcon: {
    fontSize: 16,
  },
  feeIcon: {
    fontSize: 16,
  },
});

export default LocationCard;
