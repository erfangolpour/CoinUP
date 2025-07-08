export interface Coin {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	market_cap: number;
	market_cap_rank: number;
	fully_diluted_valuation: number;
	total_volume: number;
	high_24h: number;
	low_24h: number;
	price_change_24h: number;
	price_change_percentage_24h: number;
	market_cap_change_24h: number;
	market_cap_change_percentage_24h: number;
	circulating_supply: number;
	total_supply: number;
	max_supply: number;
	ath: number;
	ath_change_percentage: number;
	ath_date: string;
	atl: number;
	atl_change_percentage: number;
	atl_date: string;
	roi: {
		times: number;
		currency: string;
		percentage: number;
	} | null;
	last_updated: string;
}

export interface CoinDetails {
	id: string;
	symbol: string;
	name: string;
	image: {
		thumb: string;
		small: string;
		large: string;
	};
	market_cap_rank: number;
	last_updated: string;
	description?: {
		en: string;
	};
	links?: {
		homepage: string[];
		blockchain_site: string[];
		official_forum_url: string[];
		chat_url: string[];
		announcement_url: string[];
		twitter_screen_name: string;
		facebook_username: string;
		bitcointalk_thread_identifier: number;
		telegram_channel_identifier: string;
		subreddit_url: string;
		repos_url: {
			github: string[];
			bitbucket: string[];
		};
	};
	market_data?: {
		current_price: { [key: string]: number };
		total_value_locked: { [key: string]: number } | null;
		mcap_to_tvl_ratio: number | null;
		fdv_to_tvl_ratio: number | null;
		roi: {
			times: number;
			currency: string;
			percentage: number;
		} | null;
		ath: { [key: string]: number };
		ath_change_percentage: { [key: string]: number };
		ath_date: { [key: string]: string };
		atl: { [key: string]: number };
		atl_change_percentage: { [key: string]: number };
		atl_date: { [key: string]: string };
		market_cap: { [key: string]: number };
		market_cap_rank: number;
		fully_diluted_valuation: { [key: string]: number };
		total_volume: { [key: string]: number };
		high_24h: { [key: string]: number };
		low_24h: { [key: string]: number };
		price_change_24h: number;
		price_change_percentage_24h: number;
		price_change_percentage_7d: number;
		price_change_percentage_14d: number;
		price_change_percentage_30d: number;
		price_change_percentage_60d: number;
		price_change_percentage_200d: number;
		price_change_percentage_1y: number;
		market_cap_change_24h: number;
		market_cap_change_percentage_24h: number;
		price_change_24h_in_currency: { [key: string]: number };
		price_change_percentage_1h_in_currency: { [key: string]: number };
		price_change_percentage_24h_in_currency: { [key: string]: number };
		price_change_percentage_7d_in_currency: { [key: string]: number };
		price_change_percentage_14d_in_currency: { [key: string]: number };
		price_change_percentage_30d_in_currency: { [key: string]: number };
		price_change_percentage_60d_in_currency: { [key: string]: number };
		price_change_percentage_200d_in_currency: { [key: string]: number };
		price_change_percentage_1y_in_currency: { [key: string]: number };
		market_cap_change_24h_in_currency: { [key: string]: number };
		market_cap_change_percentage_24h_in_currency: { [key: string]: number };
		total_supply: number | null;
		max_supply: number | null;
		circulating_supply: number;
		last_updated: string;
	};
}

export interface ChartData {
	prices: [number, number][];
	market_caps: [number, number][];
	total_volumes: [number, number][];
}

export type SortOption =
	| "market_cap_desc"
	| "market_cap_asc"
	| "volume_desc"
	| "volume_asc"
	| "price_desc"
	| "price_asc"
	| "name_desc"
	| "name_asc";

export type SortType = "market_cap" | "volume" | "price" | "name";
export type SortOrder = "asc" | "desc";
