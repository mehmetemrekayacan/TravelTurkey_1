import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserPreferences } from '../types';

// App State Store - User authentication and global app state
interface AppState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // App Preferences
  preferences: UserPreferences;

  // UI State
  activeModal: string | null;
  isOnline: boolean;
  lastSyncAt: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setActiveModal: (modal: string | null) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setLastSyncAt: (timestamp: string) => void;
  logout: () => void;
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  language: 'tr',
  theme: 'system',
  notificationsEnabled: true,
  locationPermission: false,
  favoriteCategories: [],
  biometricEnabled: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      preferences: defaultPreferences,
      activeModal: null,
      isOnline: true,
      lastSyncAt: null,

      // Actions
      setUser: user => set({ user }),
      setAuthenticated: isAuthenticated => set({ isAuthenticated }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      updatePreferences: newPreferences =>
        set(state => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      setActiveModal: activeModal => set({ activeModal }),
      setOnlineStatus: isOnline => set({ isOnline }),
      setLastSyncAt: lastSyncAt => set({ lastSyncAt }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),

      reset: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          preferences: defaultPreferences,
          activeModal: null,
          isOnline: true,
          lastSyncAt: null,
        }),
    }),
    {
      name: 'travel-turkey-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        preferences: state.preferences,
        lastSyncAt: state.lastSyncAt,
      }),
    },
  ),
);

// UI State Store - For non-persistent UI states
interface UIState {
  // Search & Filters
  searchQuery: string;
  isSearchActive: boolean;

  // Navigation
  currentTab: string;
  currentScreen: string;
  selectedLocationId: string | null;

  // Map State
  mapRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null;

  // Loading States
  loadingStates: Record<string, boolean>;

  // Actions
  setSearchQuery: (query: string) => void;
  setSearchActive: (isActive: boolean) => void;
  setCurrentTab: (tab: string) => void;
  setCurrentScreen: (screen: string) => void;
  setSelectedLocation: (locationId: string | null) => void;
  setMapRegion: (region: UIState['mapRegion']) => void;
  setLoadingState: (key: string, isLoading: boolean) => void;
  clearSearch: () => void;
  goBack: () => void;
  reset: () => void;
}

export const useUIStore = create<UIState>(set => ({
  // Initial State
  searchQuery: '',
  isSearchActive: false,
  currentTab: 'Explore',
  currentScreen: 'main',
  selectedLocationId: null,
  mapRegion: null,
  loadingStates: {},

  // Actions
  setSearchQuery: searchQuery => set({ searchQuery }),
  setSearchActive: isSearchActive => set({ isSearchActive }),
  setCurrentTab: currentTab => set({ currentTab }),
  setCurrentScreen: currentScreen => set({ currentScreen }),
  setSelectedLocation: selectedLocationId => set({ selectedLocationId }),
  setMapRegion: mapRegion => set({ mapRegion }),

  setLoadingState: (key, isLoading) =>
    set(state => ({
      loadingStates: { ...state.loadingStates, [key]: isLoading },
    })),

  clearSearch: () => set({ searchQuery: '', isSearchActive: false }),

  goBack: () => set({ currentScreen: 'main', selectedLocationId: null }),

  reset: () =>
    set({
      searchQuery: '',
      isSearchActive: false,
      currentTab: 'Explore',
      currentScreen: 'main',
      selectedLocationId: null,
      mapRegion: null,
      loadingStates: {},
    }),
}));

// Helper hooks for accessing specific store slices
export const useUser = () => useAppStore(state => state.user);
export const useIsAuthenticated = () =>
  useAppStore(state => state.isAuthenticated);
export const usePreferences = () => useAppStore(state => state.preferences);
export const useAppLoading = () => useAppStore(state => state.isLoading);
export const useAppError = () => useAppStore(state => state.error);

export const useSearchQuery = () => useUIStore(state => state.searchQuery);
export const useCurrentTab = () => useUIStore(state => state.currentTab);
export const useCurrentScreen = () => useUIStore(state => state.currentScreen);
export const useSelectedLocationId = () =>
  useUIStore(state => state.selectedLocationId);
export const useMapRegion = () => useUIStore(state => state.mapRegion);
export const useLoadingState = (key: string) =>
  useUIStore(state => state.loadingStates[key] || false);
