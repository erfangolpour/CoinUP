import { useStore } from "@/stores/useCoinStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMemo } from "react";

export const useFilteredCoins = () => {
	const { coins, searchQuery, sortType, sortOrder } = useStore();
	const { getFavorites } = useAuthStore();
	const favorites = getFavorites();

	const filteredCoins = useMemo(() => {
		let filtered = coins;

		// Filter by search query
		if (searchQuery) {
			const lowerQuery = searchQuery.toLowerCase();
			filtered = coins.filter(
				(coin) =>
					coin.name.toLowerCase().includes(lowerQuery) ||
					coin.symbol.toLowerCase().includes(lowerQuery),
			);
		}

		// Combined sorting: favorites first, then by selected sort criteria
		return filtered.sort((a, b) => {
			const aIsFavorite = favorites.includes(a.id);
			const bIsFavorite = favorites.includes(b.id);

			// If one is favorite and other is not, favorite comes first
			if (aIsFavorite && !bIsFavorite) return -1;
			if (!aIsFavorite && bIsFavorite) return 1;

			// If both are favorites or both are not, sort by the selected criteria
			switch (sortType) {
				case "market_cap":
					return sortOrder === "desc"
						? b.market_cap - a.market_cap
						: a.market_cap - b.market_cap;
				case "volume":
					return sortOrder === "desc"
						? b.total_volume - a.total_volume
						: a.total_volume - b.total_volume;
				case "price":
					return sortOrder === "desc"
						? b.current_price - a.current_price
						: a.current_price - b.current_price;
				case "name":
					return sortOrder === "desc"
						? b.name.localeCompare(a.name)
						: a.name.localeCompare(b.name);
				default:
					return 0;
			}
		});
	}, [coins, searchQuery, favorites, sortType, sortOrder]);

	return filteredCoins;
};
