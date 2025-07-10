import { useStore } from "@/stores/useCoinStore";
import type { SortType } from "@/types/coin";
import { CoinCard } from "@components/CoinCard";
import Clickable from "@components/common/Clickable";
import Timer from "@components/common/Timer";
import { CoinCardSkeleton } from "@components/skeleton/CoinCardSkeleton";
import { ENV_CONFIG } from "@config/env";
import { useDebounce } from "@hooks/useDebounce";
import { useFilteredCoins } from "@hooks/useFilteredCoins";
import { cn } from "@utils/cn";
import {
	ArrowUpDown,
	ChevronDown,
	ChevronUp,
	Filter,
	RefreshCw,
	Search,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export const CoinList: React.FC = () => {
	const {
		coins,
		loadCoins,
		searchQuery,
		sortType,
		setSortType,
		sortOrder,
		setSortOrder,
		setSearchQuery,
		isLoadingCoins,
		listLastUpdated,
	} = useStore();

	const filteredCoins = useFilteredCoins();
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		if (coins.length === 0) {
			loadCoins();
		}
	}, []);

	// Auto-refresh
	useEffect(() => {
		const interval = setInterval(() => {
			loadCoins();
		}, ENV_CONFIG.REFRESH_INTERVAL);

		return () => clearInterval(interval);
	}, [loadCoins, listLastUpdated]);

	const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

	// Debounce search to prevent excessive filtering operations
	const debouncedSearchQuery = useDebounce(
		localSearchQuery,
		ENV_CONFIG.SEARCH_DEBOUNCE_DELAY,
	);

	// Update the store when debounced value changes
	useEffect(() => {
		setSearchQuery(debouncedSearchQuery);
	}, [debouncedSearchQuery, setSearchQuery]);

	const sortTypeOptions: { value: SortType; label: string }[] = [
		{ value: "name", label: "Name" },
		{ value: "price", label: "Price" },
		{ value: "volume", label: "Volume" },
		{ value: "market_cap", label: "Market Cap" },
	];

	return (
		<div className="space-y-xl">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-sm">
					<h1 className="text-2xl-responsive font-bold">
						Cryptocurrency Tracker
					</h1>
					<p className="text-content-secondary text-base-responsive">
						{searchQuery
							? `Showing ${filteredCoins.length} result ${filteredCoins.length === 1 ? "" : "s"} for "${searchQuery}"`
							: `Tracking ${coins.length} cryptocurrencies`}
					</p>
				</div>

				{/* Last Updated */}
				<Timer
					className="hidden text-right md:block"
					lastUpdated={listLastUpdated}
					refreshInterval={ENV_CONFIG.REFRESH_INTERVAL}
				/>
			</div>

			<div className="space-x-sm flex w-full">
				{/* Search Bar */}
				<div className="relative grow">
					<Search className="text-content-tertiary size-md absolute top-1/2 left-4 -translate-y-1/2 transform" />
					<input
						type="text"
						placeholder="Search..."
						value={localSearchQuery}
						onChange={(e) => setLocalSearchQuery(e.target.value)}
						className="border-surface-600 bg-surface-800/50 placeholder-text-tertiary focus:border-primary-500 focus:ring-primary-500/20 py-md w-full rounded-xl border pr-4 pl-12 text-ellipsis transition-all duration-200 focus:ring-2 focus:outline-none"
					/>
				</div>

				{/* Sort & Filter */}
				<Clickable
					onClick={() => setShowFilters(!showFilters)}
					className="btn-primary px-lg py-sm gap-2"
				>
					<Filter className="size-sm" />
					<span>Sort</span>
				</Clickable>

				{/* Refresh Button */}
				<Clickable
					onClick={() => loadCoins()}
					disabled={isLoadingCoins}
					className="btn-ghost p-md"
				>
					<RefreshCw
						className={cn(
							"size-sm",
							isLoadingCoins && "animate-spin",
						)}
					/>
				</Clickable>
			</div>

			{/* Filter Panel */}
			<AnimatePresence>
				{showFilters && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
					>
						<div className="glass-effect gap-md p-md flex flex-col justify-between rounded-xl md:flex-row">
							{/* Sort Type */}
							<div className="gap-sm flex flex-wrap">
								{sortTypeOptions.map((option) => (
									<Clickable
										key={option.value}
										onClick={() =>
											setSortType(option.value)
										}
										className={cn(
											"px-lg py-sm text-sm-responsive",
											sortType === option.value
												? "btn-primary"
												: "btn-ghost",
										)}
									>
										{option.label}
									</Clickable>
								))}
							</div>

							{/* Sort Order */}
							<div className="gap-sm flex [&>*]:grow">
								<Clickable
									onClick={() => setSortOrder("desc")}
									className={cn(
										"space-x-xs px-lg py-sm text-xs-responsive align-middle",
										sortOrder === "desc"
											? "btn-primary"
											: "btn-ghost",
									)}
								>
									<ChevronDown className="size-sm inline" />
									<span>
										{sortType === "name"
											? "Z to A"
											: "High to Low"}
									</span>
								</Clickable>
								<Clickable
									onClick={() => setSortOrder("asc")}
									className={cn(
										"space-x-xs px-lg py-sm text-xs-responsive align-middle",
										sortOrder === "asc"
											? "btn-primary"
											: "btn-ghost",
									)}
								>
									<ChevronUp className="size-sm inline" />
									<span>
										{sortType === "name"
											? "A to Z"
											: "Low to High"}
									</span>
								</Clickable>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Coin Grid with Skeleton */}
			<motion.div className="gap-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
				<AnimatePresence mode="popLayout">
					{isLoadingCoins && coins.length === 0
						? // Loading Placeholder with shared layoutId
							[...Array(ENV_CONFIG.SKELETON_ITEM_COUNT)].map(
								(_, i) => <CoinCardSkeleton key={i} />,
							)
						: // Actual coin cards with shared layoutId
							filteredCoins.map((coin) => (
								<CoinCard
									key={coin.id}
									coin={coin}
									searchQuery={searchQuery}
								/>
							))}
				</AnimatePresence>
			</motion.div>

			{/* Empty State */}
			{filteredCoins.length === 0 && searchQuery && !isLoadingCoins && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="py-2xl text-center"
				>
					<div className="text-content-tertiary space-y-md">
						<ArrowUpDown className="size-4xl mx-auto" />
						<div>
							<p className="text-lg-responsive">
								No cryptocurrencies found
							</p>
							<p className="text-sm-responsive">
								Try adjusting your search terms
							</p>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
};
