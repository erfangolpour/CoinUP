import Timer from "@/components/common/Timer";
import { formatDate } from "@/utils/formatters";
import { PriceChart } from "@components/PriceChart";
import AnimatedNumber from "@components/common/AnimatedNumber";
import LoadingSpinner from "@components/common/LoadingSpinner";
import { CoinDetailSkeleton } from "@components/skeleton/CoinDetailSkeleton";
import { ENV_CONFIG } from "@config/env";
import { useStore } from "@stores/useStore";
import { cn } from "@utils/cn";
import {
	Activity,
	ArrowLeft,
	BarChart3,
	DollarSign,
	RefreshCw,
	Star,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import Clickable from "./common/Clickable";

export const CoinDetail: React.FC = () => {
	const {
		selectedCoin,
		setSelectedCoin,
		coinDetail,
		loadCoinDetail,
		chartData,
		loadChartData,
		favorites,
		toggleFavorite,
		isLoadingCoinDetail,
		isLoadingChartData,
		detailLastUpdated,
	} = useStore();

	const [chartPeriod, setChartPeriod] = useState(30);

	useEffect(() => {
		if (selectedCoin) {
			loadCoinDetail(selectedCoin);
			window.scrollTo(0, 0);
		}
	}, [selectedCoin, loadCoinDetail]);

	useEffect(() => {
		if (selectedCoin) {
			loadChartData(selectedCoin, chartPeriod);
		}
	}, [selectedCoin, chartPeriod, loadChartData]);

	// Auto-refresh every 30 seconds
	useEffect(() => {
		if (!selectedCoin) return;

		const interval = setInterval(() => {
			loadCoinDetail(selectedCoin);
		}, ENV_CONFIG.REFRESH_INTERVAL);

		return () => clearInterval(interval);
	}, [selectedCoin, loadCoinDetail, detailLastUpdated]);

	const handleRefresh = () => {
		if (selectedCoin) {
			loadCoinDetail(selectedCoin);
			loadChartData(selectedCoin, chartPeriod);
		}
	};

	// Show skeleton only when loading coin detail for the first time
	if (isLoadingCoinDetail && !coinDetail) {
		return <CoinDetailSkeleton />;
	}

	if (!coinDetail || !selectedCoin) return null;

	const isFavorite = favorites.includes(selectedCoin);
	const isPositive =
		(coinDetail.market_data?.price_change_percentage_24h || 0) > 0;
	const currentPrice = coinDetail.market_data?.current_price?.usd || 0;
	const priceChange24h =
		coinDetail.market_data?.price_change_percentage_24h || 0;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="space-y-8 lg:space-y-12"
		>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4 lg:space-x-6">
					<Clickable
						onClick={() => setSelectedCoin(null)}
						className="glass-effect rounded-xl p-2 text-slate-300 hover:bg-slate-600/20 hover:text-white lg:p-3"
					>
						<ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" />
					</Clickable>

					<div className="flex items-center space-x-4 lg:space-x-6">
						<div className="glass-effect flex h-16 w-16 items-center justify-center overflow-hidden rounded-full lg:h-20 lg:w-20">
							<img
								src={coinDetail.image?.large}
								alt={coinDetail.name}
								className="h-12 w-12 object-cover lg:h-16 lg:w-16"
							/>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-white lg:text-5xl">
								{coinDetail.name}
							</h1>
							<p className="text-md text-slate-400 uppercase lg:text-xl">
								{coinDetail.symbol}
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center space-x-4">
					{/* Update Info */}
					<Timer
						lastUpdated={detailLastUpdated}
						refreshInterval={ENV_CONFIG.REFRESH_INTERVAL}
						className="hidden text-right md:block"
					/>

					{/* Refresh Button */}
					<Clickable
						onClick={handleRefresh}
						disabled={isLoadingCoinDetail}
						className="glass-effect hidden rounded-xl p-3 text-slate-300 hover:bg-slate-600/20 hover:text-white md:block lg:p-4"
					>
						<RefreshCw
							className={cn(
								"h-6 w-6 lg:h-7 lg:w-7",
								isLoadingCoinDetail && "animate-spin",
							)}
						/>
					</Clickable>

					<Clickable
						onClick={() => toggleFavorite(selectedCoin)}
						className={cn(
							"rounded-xl p-3 hover:text-white lg:p-4",
							isFavorite
								? "bg-blue-600 shadow-lg shadow-blue-500/25"
								: "glass-effect text-slate-400 hover:bg-slate-600/20",
						)}
					>
						<Star
							className={cn(
								"h-6 w-6 lg:h-7 lg:w-7",
								isFavorite && "fill-current",
							)}
						/>
					</Clickable>
				</div>
			</div>

			{/* Price Section */}
			<div className="glass-effect rounded-xl p-6 backdrop-blur-sm lg:p-8">
				<div className="mb-6 flex items-start justify-between lg:mb-8">
					<div>
						<div className="mb-3 text-4xl font-bold lg:text-6xl">
							<AnimatedNumber value={currentPrice} prefix="$" />
						</div>
						<div
							className={cn(
								"flex items-center text-lg lg:text-xl",
								isPositive ? "text-green-400" : "text-red-400",
							)}
						>
							{isPositive ? (
								<TrendingUp className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
							) : (
								<TrendingDown className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
							)}
							<AnimatedNumber
								value={Math.abs(priceChange24h)}
								suffix="%"
								decimals={2}
								simplified={false}
							/>
							<span className="ml-1">(24h)</span>
						</div>
					</div>
					<div className="text-right">
						<div className="hidden text-sm text-slate-400 md:block lg:text-base">
							Market Cap Rank
						</div>
						<div className="text-2xl font-bold text-white lg:text-4xl">
							#{coinDetail.market_cap_rank}
						</div>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
					<div className="glass-effect rounded-xl p-4 text-center lg:p-6">
						<div className="mb-2 text-sm text-slate-400 lg:text-base">
							24h High
						</div>
						<div className="text-lg font-semibold lg:text-xl">
							<AnimatedNumber
								value={coinDetail.market_data?.high_24h?.usd}
								prefix="$"
							/>
						</div>
					</div>
					<div className="glass-effect rounded-xl p-4 text-center lg:p-6">
						<div className="mb-2 text-sm text-slate-400 lg:text-base">
							24h Low
						</div>
						<div className="text-lg font-semibold lg:text-xl">
							<AnimatedNumber
								value={coinDetail.market_data?.low_24h?.usd}
								prefix="$"
							/>
						</div>
					</div>
					<div className="glass-effect rounded-xl p-4 text-center lg:p-6">
						<div className="mb-2 text-sm text-slate-400 lg:text-base">
							Market Cap
						</div>
						<div className="text-lg font-semibold lg:text-xl">
							<AnimatedNumber
								value={coinDetail.market_data?.market_cap?.usd}
								prefix="$"
							/>
						</div>
					</div>
					<div className="glass-effect rounded-xl p-4 text-center lg:p-6">
						<div className="mb-2 text-sm text-slate-400 lg:text-base">
							Volume
						</div>
						<div className="text-lg font-semibold lg:text-xl">
							<AnimatedNumber
								value={
									coinDetail.market_data?.total_volume?.usd
								}
								prefix="$"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Chart Section */}
			<div className="glass-effect rounded-xl p-6 backdrop-blur-sm lg:p-8">
				<div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row lg:mb-8">
					<h2 className="text-xl font-semibold text-white lg:text-2xl">
						Price Chart
					</h2>
					<div className="flex space-x-2 lg:space-x-3">
						{ENV_CONFIG.CHART_PERIODS.map((period) => (
							<Clickable
								key={period.value}
								onClick={() => setChartPeriod(period.value)}
								className={cn(
									"rounded-lg px-3 py-1 text-sm transition-colors duration-200 hover:text-white lg:px-4 lg:py-2 lg:text-base",
									chartPeriod === period.value
										? "bg-blue-600 shadow-lg shadow-blue-500/25"
										: "glass-effect text-slate-400 hover:bg-slate-600/20",
								)}
								layout
								disabled={isLoadingChartData}
							>
								{period.label}
							</Clickable>
						))}
					</div>
				</div>

				<div className="relative h-64 lg:h-80">
					<AnimatePresence>
						{isLoadingChartData && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-black/10"
							>
								<LoadingSpinner />
							</motion.div>
						)}
					</AnimatePresence>
					<PriceChart data={chartData} period={chartPeriod} />
				</div>
			</div>

			{/* Detailed Stats */}
			<div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-2">
				{/* Market Stats */}
				<div className="glass-effect rounded-xl p-6 backdrop-blur-sm lg:p-8">
					<h3 className="mb-4 flex items-center text-lg font-semibold lg:mb-6 lg:text-xl">
						<BarChart3 className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
						Market Statistics
					</h3>
					<div className="space-y-4 lg:space-y-6">
						<div className="flex justify-between">
							<span className="text-slate-400">Market Cap</span>
							<span>
								<AnimatedNumber
									value={
										coinDetail.market_data?.market_cap?.usd
									}
									prefix="$"
								/>
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">
								Fully Diluted Valuation
							</span>
							<span>
								<AnimatedNumber
									value={
										coinDetail.market_data
											?.fully_diluted_valuation?.usd
									}
									prefix="$"
								/>
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">
								Circulating Supply
							</span>
							<span>
								<AnimatedNumber
									value={
										coinDetail.market_data
											?.circulating_supply || 0
									}
									prefix="$"
								/>
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Total Supply</span>
							<span>
								<AnimatedNumber
									value={coinDetail.market_data?.total_supply}
									prefix="$"
								/>
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Max Supply</span>
							<span>
								<AnimatedNumber
									value={coinDetail.market_data?.max_supply}
									prefix="$"
								/>
							</span>
						</div>
					</div>
				</div>

				{/* Price History */}
				<div className="glass-effect flex flex-col rounded-xl p-6 backdrop-blur-sm lg:p-8">
					<h3 className="mb-4 flex items-center text-lg font-semibold lg:mb-6 lg:text-xl">
						<Activity className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
						Price History
					</h3>
					<div className="flex grow flex-col space-y-4 lg:space-y-6">
						<div className="flex justify-between">
							<div className="flex flex-col">
								<span>All-Time High</span>
								<span className="font-medium text-slate-400">
									{coinDetail.market_data?.ath_date?.usd
										? formatDate(
												coinDetail.market_data?.ath_date
													?.usd,
											)
										: "N/A"}
								</span>
							</div>
							<div className="text-right">
								<div>
									<AnimatedNumber
										value={coinDetail.market_data?.ath?.usd}
										prefix="$"
									/>
								</div>
								<div
									className={cn(
										"flex items-center text-sm",
										(coinDetail.market_data
											?.ath_change_percentage?.usd || 0) >
											0
											? "text-green-400"
											: "text-red-400",
									)}
								>
									{(coinDetail.market_data
										?.ath_change_percentage?.usd || 0) >
									0 ? (
										<TrendingUp className="mr-1 h-4 w-4 lg:h-5 lg:w-5" />
									) : (
										<TrendingDown className="mr-1 h-4 w-4 lg:h-5 lg:w-5" />
									)}
									<AnimatedNumber
										value={Math.abs(
											coinDetail.market_data
												?.ath_change_percentage?.usd ||
												0,
										)}
										suffix="%"
										decimals={1}
										simplified={false}
									/>
								</div>
							</div>
						</div>
						<div className="flex justify-between">
							<div className="flex flex-col">
								<span>All-Time Low</span>
								<span className="text-slate-400">
									{formatDate(
										coinDetail.market_data?.atl_date?.usd ||
											"",
									)}
								</span>
							</div>
							<div className="text-right">
								<div>
									<AnimatedNumber
										value={coinDetail.market_data?.atl?.usd}
										prefix="$"
									/>
								</div>
								<div
									className={cn(
										"flex items-center text-sm",
										(coinDetail.market_data
											?.atl_change_percentage?.usd || 0) >
											0
											? "text-green-400"
											: "text-red-400",
									)}
								>
									{(coinDetail.market_data
										?.atl_change_percentage?.usd || 0) >
									0 ? (
										<TrendingUp className="mr-1 h-4 w-4 lg:h-5 lg:w-5" />
									) : (
										<TrendingDown className="mr-1 h-4 w-4 lg:h-5 lg:w-5" />
									)}
									<AnimatedNumber
										value={Math.abs(
											coinDetail.market_data
												?.atl_change_percentage?.usd ||
												0,
										)}
										suffix="%"
										decimals={1}
										simplified={false}
									/>
								</div>
							</div>
						</div>
						<div className="flex grow items-end justify-between text-sm">
							<span className="text-slate-400">Last Updated</span>
							<span>{formatDate(coinDetail.last_updated)}</span>
						</div>
					</div>
				</div>
			</div>

			{/* ROI Section */}
			{coinDetail.market_data?.roi && (
				<div className="glass-effect rounded-xl p-6 backdrop-blur-sm lg:p-8">
					<h3 className="mb-4 flex items-center text-lg font-semibold lg:mb-6 lg:text-xl">
						<DollarSign className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
						Return on Investment
					</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
						<div className="glass-effect rounded-xl p-4 text-center lg:p-6">
							<div className="text-2xl font-bold text-green-400 lg:text-3xl">
								<AnimatedNumber
									value={coinDetail.market_data?.roi?.times}
									suffix="x"
								/>
							</div>
							<div className="text-sm text-slate-400 lg:text-base">
								ROI Multiple
							</div>
						</div>
						<div className="glass-effect rounded-xl p-4 text-center lg:p-6">
							<div className="text-2xl font-bold text-green-400 lg:text-3xl">
								<AnimatedNumber
									value={
										coinDetail.market_data?.roi?.percentage
									}
									suffix="%"
									decimals={1}
									simplified={false}
								/>
							</div>
							<div className="text-sm text-slate-400 lg:text-base">
								ROI Percentage
							</div>
						</div>
						<div className="glass-effect rounded-xl p-4 text-center lg:p-6">
							<div className="text-2xl font-bold text-white lg:text-3xl">
								{coinDetail.market_data?.roi?.currency?.toUpperCase()}
							</div>
							<div className="text-sm text-slate-400 lg:text-base">
								Base Currency
							</div>
						</div>
					</div>
				</div>
			)}
		</motion.div>
	);
};
