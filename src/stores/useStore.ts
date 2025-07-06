import type { AppState, SortOption, SortOrder, SortType } from "@/types/crypto";
import { fetchChartData, fetchCoinDetail, fetchCoins } from "@api/API";
import {
	fetchMockChartData,
	fetchMockCoinDetail,
	fetchMockCoins,
} from "@api/mockAPI";
import { ENV_CONFIG } from "@config/env";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StoreActions {
	// Coins
	loadCoins: () => Promise<void>;
	setSortType: (sortType: SortType) => void;
	setSortOrder: (sortOrder: SortOrder) => void;

	// Favorites
	toggleFavorite: (coinId: string) => void;

	// Search
	setSearchQuery: (query: string) => void;

	// Selected coin
	setSelectedCoin: (coinId: string | null) => void;
	loadCoinDetail: (coinId: string) => Promise<void>;
	loadChartData: (coinId: string, days?: number) => Promise<void>;
}

type Store = AppState & StoreActions;

// Helper function to construct the sorting parameter for API calls
const getSortOption = (
	sortType: SortType,
	sortOrder: SortOrder,
): SortOption => {
	return `${sortType}_${sortOrder}` as SortOption;
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

					const coins = ENV_CONFIG.ENABLE_MOCK_API
						? await fetchMockCoins("usd", sortBy)
						: await fetchCoins("usd", sortBy);

					set({ coins, listLastUpdated: Date.now() });
				} catch (error) {
					console.error("Failed to load coins:", error);
					toast.error("Failed to load cryptocurrency data");
				}
				set({ isLoadingCoins: false });
			},

			setSortType: (sortType: SortType) => {
				set({ sortType });
			},

			setSortOrder: (sortOrder: SortOrder) => {
				set({ sortOrder });
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
			setSelectedCoin: (coinId: string | null) => {
				set({
					selectedCoin: coinId,
					coinDetail: null,
					chartData: null,
				});
			},

			loadCoinDetail: async (coinId: string) => {
				if (get().isLoadingCoinDetail) return;
				set({ isLoadingCoinDetail: true });
				try {
					const coinDetail = ENV_CONFIG.ENABLE_MOCK_API
						? await fetchMockCoinDetail(coinId)
						: await fetchCoinDetail(coinId);
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
					const chartData = ENV_CONFIG.ENABLE_MOCK_API
						? await fetchMockChartData(coinId, "usd", days)
						: await fetchChartData(coinId, "usd", days);
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
		},
	),
);
