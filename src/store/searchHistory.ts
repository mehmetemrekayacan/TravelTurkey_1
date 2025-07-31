import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchHistoryState {
  recentSearches: string[];
  addSearch: (query: string) => void;
  clearHistory: () => void;
  removeSearch: (query: string) => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    set => ({
      recentSearches: [],

      addSearch: (query: string) => {
        if (!query.trim()) return;

        set(state => {
          const filtered = state.recentSearches.filter(
            search => search.toLowerCase() !== query.toLowerCase(),
          );

          return {
            recentSearches: [query, ...filtered].slice(0, 10), // Keep max 10 searches
          };
        });
      },

      clearHistory: () => set({ recentSearches: [] }),

      removeSearch: (query: string) =>
        set(state => ({
          recentSearches: state.recentSearches.filter(
            search => search !== query,
          ),
        })),
    }),
    {
      name: 'search-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
