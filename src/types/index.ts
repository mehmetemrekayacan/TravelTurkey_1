// TravelTurkey - Main Type Definitions

export interface Location {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  city: string;
  cityEn: string;
  region: string;
  regionEn: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  category: LocationCategory;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  visitDuration: number; // minutes
  bestTimeToVisit: string[];
  accessibility: AccessibilityInfo;
  entryFee: {
    adult: number;
    student: number;
    child: number;
    currency: string;
  };
  openingHours: OpeningHours;
  contact: ContactInfo;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LocationCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  hasParking: boolean;
  hasRestroom: boolean;
  hasGuidedTour: boolean;
  audioGuideAvailable: boolean;
}

export interface OpeningHours {
  monday: TimeSlot | null;
  tuesday: TimeSlot | null;
  wednesday: TimeSlot | null;
  thursday: TimeSlot | null;
  friday: TimeSlot | null;
  saturday: TimeSlot | null;
  sunday: TimeSlot | null;
  specialDays?: SpecialDay[];
}

export interface TimeSlot {
  open: string; // "09:00"
  close: string; // "18:00"
  isClosed: boolean;
}

export interface SpecialDay {
  date: string; // "2024-01-01"
  description: string;
  descriptionEn: string;
  isClosed: boolean;
  specialHours?: TimeSlot;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: 'tr' | 'en';
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  locationPermission: boolean;
  favoriteCategories: string[];
  biometricEnabled: boolean;
}

export interface UserStats {
  visitedLocations: number;
  favoriteLocations: number;
  reviewsWritten: number;
  photosShared: number;
}

export interface Review {
  id: string;
  locationId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  visitDate: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  helpfulCount: number;
}

export interface Favorite {
  id: string;
  userId: string;
  locationId: string;
  notes?: string;
  createdAt: string;
}

// Navigation Types
export type RootStackParamList = {
  MainTabs: undefined;
  LocationDetail: { locationId: string };
  Settings: undefined;
  Profile: undefined;
  Auth: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Explore: undefined;
  Favorites: undefined;
  Map: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  Main: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Store Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  preferences: UserPreferences;
}

export interface LocationsState {
  locations: Location[];
  favorites: Favorite[];
  currentLocation: Location | null;
  searchQuery: string;
  filters: LocationFilters;
  isLoading: boolean;
  error: string | null;
}

export interface LocationFilters {
  categories: string[];
  regions: string[];
  rating: number;
  hasEntryFee: boolean | null;
  isAccessible: boolean | null;
  sortBy: 'name' | 'rating' | 'distance' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

// Utility Types
export interface OfflineData {
  locations: Location[];
  categories: LocationCategory[];
  favorites: Favorite[];
  lastSyncAt: string;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncAt: string | null;
  pendingSync: string[];
  syncInProgress: boolean;
}
