// Environment configuration with defaults
export const ENV_CONFIG = {
	// API Configuration
	COINGECKO_BASE_URL: "/api/api/v3",
	COINGECKO_API_KEY: import.meta.env.VITE_COINGECKO_API_KEY || "",

	// Refresh intervals
	REFRESH_INTERVAL: 5000,

	// Search debounce delay
	SEARCH_DEBOUNCE_DELAY: 300,

	// Chart options
	CHART_PERIODS: [
		{ value: 7, label: "7D" },
		{ value: 30, label: "30D" },
		{ value: 90, label: "90D" },
		{ value: 365, label: "1Y" },
	] as const,

	// Skeleton loading constants
	SKELETON_ITEM_COUNT: 15,

	// Feature flags
	ENABLE_MOCK_API: true,
} as const;

// Validate required environment variables
if (!ENV_CONFIG.COINGECKO_API_KEY && !ENV_CONFIG.ENABLE_MOCK_API) {
	console.warn("VITE_COINGECKO_API_KEY is not set and mock API is disabled");
}
