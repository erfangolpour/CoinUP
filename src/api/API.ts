import axios from "axios";
import { ENV_CONFIG } from "../config/env";
import type { ChartData, Coin, CoinDetail } from "../types/crypto";

const API_KEY = ENV_CONFIG.COINGECKO_API_KEY;
const BASE_URL = ENV_CONFIG.COINGECKO_BASE_URL;

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		accept: "application/json",
		"x-cg-demo-api-key": API_KEY,
	},
});

const POPULAR_COINS = [
	"bitcoin",
	"ethereum",
	"tether",
	"usd-coin",
	"binancecoin",
	"ripple",
	"solana",
	"cardano",
	"dogecoin",
	"shiba-inu",
	"polkadot",
	"tron",
	"avalanche-2",
	"chainlink",
	"matic-network",
	"litecoin",
	"polygon",
	"wrapped-bitcoin",
	"uniswap",
	"ethereum-classic",
];

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCacheKey = (url: string, params?: any): string => {
	return `${url}${params ? JSON.stringify(params) : ""}`;
};

const getFromCache = (key: string): any | null => {
	const cached = cache.get(key);
	if (cached && Date.now() - cached.timestamp < cached.ttl) {
		return cached.data;
	}
	cache.delete(key);
	return null;
};

const setCache = (key: string, data: any, ttl: number = 60000): void => {
	cache.set(key, { data, timestamp: Date.now(), ttl });
};

export const fetchCoins = async (
	vsCurrency: string = "usd",
	order: string = "market_cap_desc",
): Promise<Coin[]> => {
	try {
		const response = await api.get("/coins/markets", {
			params: {
				vs_currency: vsCurrency,
				ids: POPULAR_COINS.join(","),
				order,
				price_change_percentage: "24h",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching coins:", error);
		throw error;
	}
};

export const fetchCoinDetail = async (coinId: string): Promise<CoinDetail> => {
	try {
		const response = await api.get(`/coins/${coinId}`, {
			params: {
				localization: false,
				tickers: false,
				community_data: false,
				developer_data: false,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching coin detail:", error);
		throw error;
	}
};

export const fetchChartData = async (
	coinId: string,
	vsCurrency: string = "usd",
	days: number = 30,
	interval: string = "daily",
): Promise<ChartData> => {
	const cacheKey = getCacheKey(`/coins/${coinId}/market_chart`, {
		vsCurrency,
		days,
		interval,
	});

	const cached = getFromCache(cacheKey);
	if (cached) {
		return cached;
	}

	try {
		const response = await api.get(`/coins/${coinId}/market_chart`, {
			params: {
				vs_currency: vsCurrency,
				days,
				interval,
				precision: 3,
			},
		});

		const chartData = response.data;
		setCache(cacheKey, chartData, 3600000); // Cache for 1 hour
		return chartData;
	} catch (error) {
		console.error("Error fetching chart data:", error);
		throw error;
	}
};
