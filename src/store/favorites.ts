import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location } from '../types';

interface FavoritesState {
  favoriteIds: string[];
  favoriteLocations: Location[];

  // Actions
  addToFavorites: (location: Location) => void;
  removeFromFavorites: (locationId: string) => void;
  toggleFavorite: (location: Location) => void;
  isFavorite: (locationId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Initial State
      favoriteIds: [],
      favoriteLocations: [],

      // Actions
      addToFavorites: (location: Location) =>
        set(state => {
          if (state.favoriteIds.includes(location.id)) {
            return state; // Already in favorites
          }

          const updatedLocation = { ...location, isFavorite: true };
          return {
            favoriteIds: [...state.favoriteIds, location.id],
            favoriteLocations: [...state.favoriteLocations, updatedLocation],
          };
        }),

      removeFromFavorites: (locationId: string) =>
        set(state => ({
          favoriteIds: state.favoriteIds.filter(id => id !== locationId),
          favoriteLocations: state.favoriteLocations.filter(
            loc => loc.id !== locationId,
          ),
        })),

      toggleFavorite: (location: Location) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();

        if (isFavorite(location.id)) {
          removeFromFavorites(location.id);
        } else {
          addToFavorites(location);
        }
      },

      isFavorite: (locationId: string) => {
        const state = get();
        return state.favoriteIds.includes(locationId);
      },

      clearFavorites: () =>
        set({
          favoriteIds: [],
          favoriteLocations: [],
        }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
