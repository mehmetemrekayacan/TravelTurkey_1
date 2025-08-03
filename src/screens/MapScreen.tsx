import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { usePreferences, useUIStore, useSelectedLocationId } from '../store';
import { useFavoritesStore } from '../store/favorites';
import { MapComponent } from '../components/MapComponent';
import { mockLocations } from '../data/locations';
import { Location } from '../types';

const MapScreen: React.FC = () => {
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';

  const { setCurrentScreen, setSelectedLocation } = useUIStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const selectedLocationIdFromStore = useSelectedLocationId();

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    selectedLocationIdFromStore, // Store'dan gelen değeri kullan
  );

  // Store'dan gelen selectedLocationId değiştiğinde local state'i güncelle
  useEffect(() => {
    console.log(
      'MapScreen: selectedLocationIdFromStore changed to:',
      selectedLocationIdFromStore,
    );
    setSelectedLocationId(selectedLocationIdFromStore);
  }, [selectedLocationIdFromStore]);

  const handleLocationPress = (location: Location) => {
    console.log('MapScreen: Setting selected location to:', location.id);
    setSelectedLocationId(location.id);
    setSelectedLocation(location.id); // Store'u da güncelle
  };

  const handleDirectionsPress = (location: Location) => {
    const { latitude, longitude } = location.coordinates;
    const locationName = encodeURIComponent(location.name);

    // Sadece yol güzergahını göster (navigation başlatma)
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${locationName}`;

    // Web tarayıcısında Google Maps'i aç (sadece güzergah göster)
    Linking.openURL(webUrl).catch(() => {
      Alert.alert(
        'Yol Tarifi Hatası',
        'Harita açılamadı. İnternet bağlantınızı kontrol edin.',
        [{ text: 'Tamam' }],
      );
    });
  };

  const handleViewDetails = () => {
    if (selectedLocationId) {
      setSelectedLocation(selectedLocationId);
      setCurrentScreen('detail');
    }
  };

  const handleToggleFavorite = () => {
    if (selectedLocationId) {
      const location = mockLocations.find(loc => loc.id === selectedLocationId);
      if (location) {
        toggleFavorite(location);
      }
    }
  };

  const selectedLocation = selectedLocationId
    ? mockLocations.find(loc => loc.id === selectedLocationId)
    : null;

  const backgroundColor = isDark ? '#121212' : '#FAFAFA';
  const textColor = isDark ? '#FFFFFF' : '#212121';
  const subtitleColor = isDark ? '#B0B0B0' : '#666666';
  const panelBackgroundColor = isDark ? '#2C2C2C' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          🗺️ Türkiye Haritası
        </Text>
        <Text style={[styles.headerSubtitle, { color: subtitleColor }]}>
          {mockLocations.length} lokasyon gösteriliyor
        </Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapComponent
          locations={mockLocations}
          selectedLocationId={selectedLocationId}
          onLocationPress={handleLocationPress}
          onDirectionsPress={handleDirectionsPress}
          showUserLocation={true}
        />
      </View>

      {/* Selected Location Info */}
      {selectedLocation && (
        <View
          style={[styles.infoPanel, { backgroundColor: panelBackgroundColor }]}
        >
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setSelectedLocationId(null);
              setSelectedLocation(null); // Store'dan da temizle
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.infoContent}>
            <View style={styles.locationInfo}>
              <Text style={[styles.locationName, { color: textColor }]}>
                {selectedLocation.category.icon} {selectedLocation.name}
              </Text>
              <Text style={[styles.locationDetails, { color: subtitleColor }]}>
                📍 {selectedLocation.city}, {selectedLocation.region}
              </Text>
              <Text style={[styles.locationRating, { color: subtitleColor }]}>
                ⭐ {selectedLocation.rating} (
                {selectedLocation.reviewCount.toLocaleString()} değerlendirme)
              </Text>
            </View>

            <View style={styles.infoActions}>
              <TouchableOpacity
                style={[
                  styles.favoriteButton,
                  isFavorite(selectedLocation.id)
                    ? styles.favoriteButtonActive
                    : styles.favoriteButtonInactive,
                ]}
                onPress={handleToggleFavorite}
                activeOpacity={0.7}
              >
                <Text style={styles.favoriteIcon}>
                  {isFavorite(selectedLocation.id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.directionsButton]}
                onPress={() => handleDirectionsPress(selectedLocation)}
                activeOpacity={0.7}
              >
                <Text style={styles.directionsButtonText}>🧭 Yol Tarifi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.detailButton]}
                onPress={handleViewDetails}
                activeOpacity={0.7}
              >
                <Text style={styles.detailButtonText}>Detaylar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  mapContainer: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 16,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  infoContent: {
    padding: 16,
  },
  locationInfo: {
    marginBottom: 16,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationRating: {
    fontSize: 14,
  },
  infoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D62828',
  },
  favoriteButtonActive: {
    backgroundColor: '#D62828',
  },
  favoriteButtonInactive: {
    backgroundColor: 'transparent',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  directionsButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailButton: {
    flex: 1,
    marginLeft: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#D62828',
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MapScreen;
