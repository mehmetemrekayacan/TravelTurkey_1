import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { usePreferences } from '../store';
import { mockLocations } from '../data/locations';
import { Location } from '../types';

interface MapComponentProps {
  locations?: Location[];
  selectedLocationId?: string | null;
  onLocationPress?: (location: Location) => void;
  onDirectionsPress?: (location: Location) => void;
  showUserLocation?: boolean;
  style?: any;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  locations = mockLocations,
  selectedLocationId,
  onLocationPress,
  style,
}) => {
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';
  const mapRef = useRef<MapView>(null);

  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render için

  // Default region (Turkey center)
  const defaultRegion: Region = {
    latitude: 39.9334,
    longitude: 32.8597,
    latitudeDelta: 10.0,
    longitudeDelta: 10.0,
  };

  // Focus on selected location when selectedLocationId changes
  useEffect(() => {
    // Force marker re-render
    setForceUpdate(prev => prev + 1);

    if (selectedLocationId && mapRef.current) {
      const selectedLocation = locations.find(
        loc => loc.id === selectedLocationId,
      );
      if (selectedLocation) {
        const region = {
          latitude: selectedLocation.coordinates.latitude,
          longitude: selectedLocation.coordinates.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };


        // MapView'ın hazır olması için kısa bir gecikme
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion(region, 1500);
          }
        }, 100);
      }
    }
  }, [selectedLocationId, locations]);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setUserLocation(newRegion);

        // Focus map on user location
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      },
      error => {

        if (error.code === 1) {

          Alert.alert(
            'Konum İzni Gerekli',
            'Konumunuzu görmek için lütfen uygulama ayarlarından konum iznini açın.',
            [{ text: 'Tamam', style: 'default' }],
          );
        } else if (error.code === 2) {

          Alert.alert(
            'Konum Servisi Kapalı',
            'Telefonunuzun konum servisi kapalı görünüyor. Lütfen ayarlardan konumu açın.',
            [{ text: 'Tamam', style: 'default' }],
          );
        } else if (error.code === 3) {

          Alert.alert(
            'Konum Bulunamadı',
            'Konum bilgisi alınamadı. İnternet bağlantınızı kontrol edin.',
            [
              { text: 'Tekrar Dene', onPress: getCurrentLocation },
              { text: 'İptal', style: 'cancel' },
            ],
          );
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 30000,
      },
    );
  }, []);

  // Request location permission and get location
  const requestLocationAndGetPosition = useCallback(async () => {
    try {
      // Android için hem FINE hem COARSE location izni iste
      const fineLocationResult = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );

      if (fineLocationResult === RESULTS.GRANTED) {
        setLocationPermission(true);

        getCurrentLocation(); // İzin verildikten sonra konum al
      } else if (fineLocationResult === RESULTS.DENIED) {
        // COARSE location'ı dene
        const coarseLocationResult = await request(
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        );
        if (coarseLocationResult === RESULTS.GRANTED) {
          setLocationPermission(true);

          getCurrentLocation(); // İzin verildikten sonra konum al
        } else {
          setLocationPermission(false);

        }
      } else {
        setLocationPermission(false);

      }
    } catch (error) {

      setLocationPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    // Sadece izin kontrolü yap, otomatik konum alma
    const checkPermission = async () => {
      try {
        const fineLocationResult = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        if (fineLocationResult === RESULTS.GRANTED) {
          setLocationPermission(true);
        }
      } catch (error) {

      } finally {
        setIsLoading(false);
      }
    };

    checkPermission();
  }, []);

  // Get marker color based on category
  const getMarkerColor = (location: Location): string => {
    switch (location.category.id) {
      case 'historical':
        return '#8B4513'; // Brown
      case 'natural':
        return '#228B22'; // Green
      case 'cultural':
        return '#9370DB'; // Purple
      case 'adventure':
        return '#FF4500'; // Orange
      default:
        return '#D62828'; // Red
    }
  };

  // Handle marker press - güvenli hata yönetimi ile
  const handleMarkerPress = useCallback(
    (location: Location) => {
      try {

        if (onLocationPress && typeof onLocationPress === 'function') {
          onLocationPress(location);
        }
      } catch (error) {
        console.error('Error in handleMarkerPress:', error);
        Alert.alert('Hata', 'Lokasyon seçilirken bir hata oluştu.');
      }
    },
    [onLocationPress],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#D62828" />
        <Text style={styles.loadingText}>Harita yükleniyor...</Text>
      </View>
    );
  }

  const initialRegion = defaultRegion; // Always start with Turkey view

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        region={undefined} // No automatic region updates
        showsUserLocation={false} // Disable built-in user location
        showsMyLocationButton={false} // Disable built-in location button
        followsUserLocation={false} // No camera following
        mapType={isDark ? 'hybrid' : 'standard'}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {/* User Location Marker - Manual */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Konumunuz"
            description="Şu anda bulunduğunuz yer"
            pinColor="blue"
          >
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationDot} />
            </View>
          </Marker>
        )}

        {/* Location Markers */}
        {locations &&
          locations.length > 0 &&
          locations.map(location => {
            if (!location || !location.coordinates) {
              return null;
            }

            const isSelected = selectedLocationId === location.id;
            const markerBackgroundColor = getMarkerColor(location);
            const markerBorderColor = isSelected ? '#FFFFFF' : 'transparent';
            const markerBorderWidth = isSelected ? 3 : 0;

            return (
              <Marker
                key={`${location.id}-${isSelected}-${forceUpdate}`} // Force re-render
                coordinate={{
                  latitude: location.coordinates.latitude,
                  longitude: location.coordinates.longitude,
                }}
                title={location.name}
                description={`${location.city}, ${location.region}`}
                onPress={() => handleMarkerPress(location)}
              >
                {/* Custom Marker with Category Icon */}
                <View
                  style={[
                    styles.customMarker,
                    {
                      backgroundColor: markerBackgroundColor,
                      borderColor: markerBorderColor,
                      borderWidth: markerBorderWidth,
                    },
                  ]}
                >
                  <Text style={styles.markerIcon}>
                    {location.category?.icon || '📍'}
                  </Text>
                </View>
              </Marker>
            );
          })}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => {
            if (locationPermission) {
              getCurrentLocation(); // Konum var ise direkt konum al
            } else {
              requestLocationAndGetPosition(); // İzin yok ise önce izin iste
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.locationButtonText}>📍 Konumu Bul</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  locationButton: {
    backgroundColor: '#D62828',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
  },
});

export default MapComponent;
