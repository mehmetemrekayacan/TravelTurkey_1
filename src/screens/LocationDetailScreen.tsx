import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { mockLocations } from '../data/locations';
import { useUIStore, useSelectedLocationId } from '../store';
import { useFavoritesStore } from '../store/favorites';

const { width } = Dimensions.get('window');

const LocationDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const selectedLocationId = useSelectedLocationId();
  const { goBack } = useUIStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const location = mockLocations.find(loc => loc.id === selectedLocationId);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lokasyon bulunamadı</Text>
      </View>
    );
  }

  const handleFavoritePress = () => {
    toggleFavorite(location);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: location.images[0] }}
          style={styles.headerImage}
          resizeMode="cover"
        />

        {/* Header Controls */}
        <View style={styles.headerControls}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFavoritePress}
            style={styles.favoriteButton}
          >
            <Text style={styles.favoriteButtonText}>
              {isFavorite(location.id) ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title Overlay */}
        <View style={styles.titleOverlay}>
          <Text style={styles.title}>{location.name}</Text>
          <Text style={styles.location}>
            📍 {location.city}, {location.region}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating & Info */}
        <View style={styles.infoSection}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {location.rating}</Text>
            <Text style={styles.reviewCount}>
              ({location.reviewCount.toLocaleString()} değerlendirme)
            </Text>
          </View>

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryIcon}>{location.category.icon}</Text>
            <Text style={styles.categoryName}>{location.category.name}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Hakkında</Text>
          <Text style={styles.description}>{location.description}</Text>
        </View>

        {/* Opening Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕒 Açılış Saatleri</Text>
          <View style={styles.hoursContainer}>
            {Object.entries(location.openingHours).map(([day, hours]) => (
              <View key={day} style={styles.hourRow}>
                <Text style={styles.dayText}>{getDayName(day)}</Text>
                <Text style={styles.timeText}>
                  {hours.isClosed ? 'Kapalı' : `${hours.open} - ${hours.close}`}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Entry Fee */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Giriş Ücreti</Text>
          <View style={styles.feeContainer}>
            <Text style={styles.feeText}>
              Yetişkin:{' '}
              {location.entryFee.adult === 0
                ? 'Ücretsiz'
                : `${location.entryFee.adult} ${location.entryFee.currency}`}
            </Text>
            <Text style={styles.feeText}>
              Öğrenci:{' '}
              {location.entryFee.student === 0
                ? 'Ücretsiz'
                : `${location.entryFee.student} ${location.entryFee.currency}`}
            </Text>
            <Text style={styles.feeText}>
              Çocuk:{' '}
              {location.entryFee.child === 0
                ? 'Ücretsiz'
                : `${location.entryFee.child} ${location.entryFee.currency}`}
            </Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 İletişim</Text>
          <Text style={styles.contactText}>📱 {location.contact.phone}</Text>
          <Text style={styles.contactText}>📧 {location.contact.email}</Text>
          <Text style={styles.contactText}>🌐 {location.contact.website}</Text>
          <Text style={styles.contactText}>📍 {location.contact.address}</Text>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ Etiketler</Text>
          <View style={styles.tagsContainer}>
            {location.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Photo Gallery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Fotoğraflar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {location.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const getDayName = (day: string): string => {
  const dayNames: Record<string, string> = {
    monday: 'Pazartesi',
    tuesday: 'Salı',
    wednesday: 'Çarşamba',
    thursday: 'Perşembe',
    friday: 'Cuma',
    saturday: 'Cumartesi',
    sunday: 'Pazar',
  };
  return dayNames[day] || day;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerControls: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    fontSize: 20,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666666',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  hoursContainer: {
    gap: 8,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 16,
    color: '#666666',
  },
  feeContainer: {
    gap: 8,
  },
  feeText: {
    fontSize: 16,
    color: '#666666',
  },
  contactText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
  },
  bottomSpacing: {
    height: 100,
  },
  errorText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginTop: 100,
  },
});

export default LocationDetailScreen;
