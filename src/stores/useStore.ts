import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-toastify";
import type {
  AppState,
  Coin,
  SortOption,
  SortType,
  SortOrder,
} from "@/types/crypto";
import {
  fetchMockCoins,
  fetchMockCoinDetail,
  fetchMockChartData,
} from "@api/mockAPI";

interface StoreActions {
  // Coins
  loadCoins: () => Promise<void>;
  setSortType: (sortType: SortType) => void;
  setSortOrder: (sortOrder: SortOrder) => void;

  // Favorites
  toggleFavorite: (coinId: string) => void;

  // Search
  setSearchQuery: (query: string) => void;
  getFilteredCoins: () => Coin[];

  // Selected coin
  setSelectedCoin: (coinId: string | null) => void;
  loadCoinDetail: (coinId: string) => Promise<void>;
  loadChartData: (coinId: string, days?: number) => Promise<void>;
}

type Store = AppState & StoreActions;

// Helper function to construct the sorting parameter for API calls
const getSortOption = (
  sortType: SortType,
  sortOrder: SortOrder
): SortOption => {
  return `${sortType}_${sortOrder}` as SortOption;
};

const sortCoins = (
  coins: Coin[],
  sortType: SortType,
  sortOrder: SortOrder
): Coin[] => {
  const sorted = [...coins];
  const sortBy = getSortOption(sortType, sortOrder);

  switch (sortBy) {
    case "market_cap_desc":
      return sorted.sort((a, b) => b.market_cap - a.market_cap);
    case "market_cap_asc":
      return sorted.sort((a, b) => a.market_cap - b.market_cap);
    case "volume_desc":
      return sorted.sort((a, b) => b.total_volume - a.total_volume);
    case "volume_asc":
      return sorted.sort((a, b) => a.total_volume - b.total_volume);
    case "price_desc":
      return sorted.sort((a, b) => b.current_price - a.current_price);
    case "price_asc":
      return sorted.sort((a, b) => a.current_price - b.current_price);
    case "name_desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Initial state
      coins: [],
      favorites: [],
      selectedCoin: null,
      coinDetail: null,
      chartData: null,
      searchQuery: "",
      sortType: "market_cap",
      sortOrder: "desc",
      isLoadingCoins: false,
      isLoadingCoinDetail: false,
      isLoadingChartData: false,
      listLastUpdated: 0,
      detailLastUpdated: 0,

      // Actions
      loadCoins: async () => {
        if (get().isLoadingCoins) return;
        set({ isLoadingCoins: true });
        try {
          const { sortType, sortOrder } = get();
          const sortBy = getSortOption(sortType, sortOrder);

          // const coins = await fetchCoins("usd", sortBy);
          const coins = await fetchMockCoins("usd", sortBy);

          set({ coins, listLastUpdated: Date.now() });
        } catch (error) {
          console.error("Failed to load coins:", error);
          toast.error("Failed to load cryptocurrency data");
        }
        set({ isLoadingCoins: false });
      },

      setSortType: (sortType: SortType) => {
        const { sortOrder } = get();
        set({
          sortType,
          coins: sortCoins(get().coins, sortType, sortOrder),
        });
      },

      setSortOrder: (sortOrder: SortOrder) => {
        const { sortType } = get();
        set({
          sortOrder,
          coins: sortCoins(get().coins, sortType, sortOrder),
        });
      },

      toggleFavorite: (coinId: string) => {
        const { favorites } = get();
        if (favorites.includes(coinId)) {
          set({ favorites: favorites.filter((id) => id !== coinId) });
        } else {
          set({ favorites: [...favorites, coinId] });
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      getFilteredCoins: () => {
        const { coins, searchQuery, favorites, sortType, sortOrder } = get();
        let filtered = coins;

        // Filter by search query
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filtered = coins.filter(
            (coin) =>
              coin.name.toLowerCase().includes(lowerQuery) ||
              coin.symbol.toLowerCase().includes(lowerQuery)
          );
        }

        // Apply sorting to filtered results
        filtered = sortCoins(filtered, sortType, sortOrder);

        // Sort favorites first
        return filtered.sort((a, b) => {
          const aIsFavorite = favorites.includes(a.id);
          const bIsFavorite = favorites.includes(b.id);

          if (aIsFavorite && !bIsFavorite) return -1;
          if (!aIsFavorite && bIsFavorite) return 1;
          return 0;
        });
      },

      setSelectedCoin: (coinId: string | null) => {
        set({ selectedCoin: coinId, coinDetail: null, chartData: null });
      },

      loadCoinDetail: async (coinId: string) => {
        if (get().isLoadingCoinDetail) return;
        set({ isLoadingCoinDetail: true });
        try {
          // const coinDetail = await fetchCoinDetail(coinId);
          const coinDetail = await fetchMockCoinDetail(coinId);
          set({ coinDetail, detailLastUpdated: Date.now() });
        } catch (error) {
          console.error("Failed to load coin detail:", error);
          toast.error("Failed to load coin details");
        }
        set({ isLoadingCoinDetail: false });
      },

      loadChartData: async (coinId: string, days: number = 30) => {
        if (get().isLoadingChartData) return;
        set({ isLoadingChartData: true });
        try {
          // const chartData = await fetchChartData(coinId, "usd", days);
          const chartData = await fetchMockChartData(coinId, "usd", days);
          set({ chartData });
        } catch (error) {
          console.error("Failed to load chart data:", error);
          toast.error("Failed to load chart data");
        }
        set({ isLoadingChartData: false });
      },
    }),
    {
      name: "crypto-tracker-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        sortType: state.sortType,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
