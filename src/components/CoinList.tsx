import type { SortType } from "@/types/crypto";
import { CoinCard } from "@components/CoinCard";
import Clickable from "@components/common/Clickable";
import Timer from "@components/common/Timer";
import { CoinCardSkeleton } from "@components/skeleton/CoinCardSkeleton";
import { ENV_CONFIG } from "@config/env";
import { useFilteredCoins } from "@hooks/useFilteredCoins";
import { useStore } from "@stores/useStore";
import { cn } from "@utils/cn";
import {
	ArrowUpDown,
	ChevronDown,
	ChevronUp,
	Filter,
	RefreshCw,
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
		isLoadingCoins: isLoading,
		listLastUpdated,
	} = useStore();

	const filteredCoins = useFilteredCoins();
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		if (coins.length === 0) {
			loadCoins();
		}
	}, []);

	// Auto-refresh every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			loadCoins();
		}, ENV_CONFIG.REFRESH_INTERVAL);

		return () => clearInterval(interval);
	}, [loadCoins, listLastUpdated]);

	const sortTypeOptions: { value: SortType; label: string }[] = [
		{ value: "name", label: "Name" },
		{ value: "price", label: "Price" },
		{ value: "volume", label: "Volume" },
		{ value: "market_cap", label: "Market Cap" },
	];

	return (
		<div className="space-y-8 lg:space-y-12">
			{/* Header */}
			<div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-8">
				<div className="w-full space-y-3">
					<h1 className="text-3xl font-bold lg:text-4xl">
						Cryptocurrency Tracker
					</h1>
					<p className="text-lg text-slate-400">
						{searchQuery
							? `Showing ${filteredCoins.length} result
                ${filteredCoins.length === 1 ? "" : "s"} for "${searchQuery}"`
							: `Tracking ${coins.length} cryptocurrencies`}
					</p>
				</div>

				<div className="flex w-full items-center justify-between space-x-4 lg:justify-end lg:space-x-6">
					{/* Last Updated */}
					<Timer
						lastUpdated={listLastUpdated}
						refreshInterval={ENV_CONFIG.REFRESH_INTERVAL}
						className="text-left lg:text-right"
					/>

					<div className="flex gap-3">
						{/* Refresh Button */}
						<Clickable
							onClick={() => loadCoins()}
							disabled={isLoading}
							className="glass-effect rounded-xl p-3 text-slate-300 hover:bg-slate-600/20 hover:text-white lg:p-4"
						>
							<RefreshCw
								className={cn(
									"h-4 w-4 lg:h-5 lg:w-5",
									isLoading && "animate-spin",
								)}
							/>
						</Clickable>

						{/* Sort & Filter */}
						<Clickable
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2 shadow-lg shadow-blue-500/25 hover:bg-blue-700 lg:px-6 lg:py-3"
						>
							<Filter className="h-4 w-4 lg:h-5 lg:w-5" />
							<span>Sort</span>
						</Clickable>
					</div>
				</div>
			</div>

			{/* Filter Panel */}
			<AnimatePresence>
				{showFilters && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
					>
						<div className="glass-effect flex flex-col justify-between gap-5 rounded-xl p-6 md:flex-row">
							{/* Sort Type */}
							<div className="flex flex-wrap gap-3 lg:gap-4">
								{sortTypeOptions.map((option) => (
									<Clickable
										key={option.value}
										onClick={() =>
											setSortType(option.value)
										}
										className={cn(
											"rounded-xl px-4 py-2 text-sm font-medium lg:px-6 lg:py-3 lg:text-base",
											sortType === option.value
												? "bg-blue-600 shadow-lg shadow-blue-500/25"
												: "glass-effect text-slate-300 hover:bg-slate-600/20 hover:text-white",
										)}
									>
										{option.label}
									</Clickable>
								))}
							</div>

							{/* Sort Order */}
							<div className="flex gap-3 lg:gap-4">
								<Clickable
									onClick={() => setSortOrder("desc")}
									className={cn(
										"flex grow items-center space-x-2 rounded-xl px-4 py-2 text-xs font-medium lg:px-6 lg:py-3 lg:text-base",
										sortOrder === "desc"
											? "bg-blue-600 shadow-lg shadow-blue-500/25"
											: "glass-effect text-slate-300 hover:bg-slate-600/20 hover:text-white",
									)}
								>
									<ChevronDown className="h-4 w-4" />
									<span>
										{sortType === "name"
											? "Z to A"
											: "High to Low"}
									</span>
								</Clickable>
								<Clickable
									onClick={() => setSortOrder("asc")}
									className={cn(
										"flex grow items-center space-x-2 rounded-xl px-4 py-2 text-xs font-medium lg:px-6 lg:py-3 lg:text-base",
										sortOrder === "asc"
											? "bg-blue-600 shadow-lg shadow-blue-500/25"
											: "glass-effect text-slate-300 hover:bg-slate-600/20 hover:text-white",
									)}
								>
									<ChevronUp className="h-4 w-4" />
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
			<motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
				<AnimatePresence mode="popLayout">
					{isLoading && coins.length === 0
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
			{filteredCoins.length === 0 && searchQuery && !isLoading && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="py-12 text-center"
				>
					<div className="mb-4 text-slate-400">
						<ArrowUpDown className="mx-auto mb-4 h-16 w-16 opacity-50" />
						<p className="text-lg">No cryptocurrencies found</p>
						<p className="text-sm">
							Try adjusting your search terms
						</p>
					</div>
				</motion.div>
			)}
		</div>
	);
};
