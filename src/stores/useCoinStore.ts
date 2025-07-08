import type {
	ChartData,
	Coin,
	CoinDetails,
	SortOrder,
	SortType,
} from "@/types/coin";
import { fetchChartData, fetchCoinDetails, fetchCoins } from "@api/API";
import {
	fetchMockChartData,
	fetchMockCoinDetails,
	fetchMockCoins,
} from "@api/mockAPI";
import { ENV_CONFIG } from "@config/env";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CoinState {
	coins: Coin[];
	selectedCoin: string | null;
	CoinDetails: CoinDetails | null;
	chartData: ChartData | null;
	searchQuery: string;
	sortType: SortType;
	sortOrder: SortOrder;
	isLoadingCoins: boolean;
	isLoadingCoinDetails: boolean;
	isLoadingChartData: boolean;
	listLastUpdated: number;
	detailLastUpdated: number;
}

interface CoinActions {
	// Coins
	loadCoins: () => Promise<void>;
	setSortType: (sortType: SortType) => void;
	setSortOrder: (sortOrder: SortOrder) => void;

	// Search
	setSearchQuery: (query: string) => void;

	// Selected coin
	setSelectedCoin: (coinId: string | null) => void;
	loadCoinDetails: (coinId: string) => Promise<void>;
	loadChartData: (coinId: string, days?: number) => Promise<void>;
}

type Store = CoinState & CoinActions;

export const useStore = create<Store>()(
	persist(
		(set, get) => ({
			// Initial state
			coins: [],
			selectedCoin: null,
			CoinDetails: null,
			chartData: null,
			searchQuery: "",
			sortType: "market_cap",
			sortOrder: "desc",
			isLoadingCoins: false,
			isLoadingCoinDetails: false,
			isLoadingChartData: false,
			listLastUpdated: 0,
			detailLastUpdated: 0,

			// Actions
			loadCoins: async () => {
				if (get().isLoadingCoins) return;
				set({ isLoadingCoins: true });
				try {
					const { sortType, sortOrder } = get();
					const sortBy = `${sortType}_${sortOrder}`;

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

			setSearchQuery: (query: string) => {
				set({ searchQuery: query });
			},
			setSelectedCoin: (coinId: string | null) => {
				set({
					selectedCoin: coinId,
					CoinDetails: null,
					chartData: null,
				});
			},

			loadCoinDetails: async (coinId: string) => {
				if (get().isLoadingCoinDetails) return;
				set({ isLoadingCoinDetails: true });
				try {
					const CoinDetails = ENV_CONFIG.ENABLE_MOCK_API
						? await fetchMockCoinDetails(coinId)
						: await fetchCoinDetails(coinId);
					set({ CoinDetails, detailLastUpdated: Date.now() });
				} catch (error) {
					console.error("Failed to load coin detail:", error);
					toast.error("Failed to load coin details");
				}
				set({ isLoadingCoinDetails: false });
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
				sortType: state.sortType,
				sortOrder: state.sortOrder,
			}),
		},
	),
);
