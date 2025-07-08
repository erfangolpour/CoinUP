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
			className="space-y-2xl"
		>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-x-lg flex items-center">
					<Clickable
						onClick={() => setSelectedCoin(null)}
						className="btn-ghost p-sm"
					>
						<ArrowLeft className="size-md" />
					</Clickable>

					<div className="space-x-lg flex items-center">
						<div className="glass-effect size-5xl flex items-center justify-center overflow-hidden rounded-full">
							<img
								src={coinDetail.image?.large}
								alt={coinDetail.name}
								className="size-4xl object-cover"
							/>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-white lg:text-5xl">
								{coinDetail.name}
							</h1>
							<p className="text-base-responsive text-content-secondary uppercase">
								{coinDetail.symbol}
							</p>
						</div>
					</div>
				</div>

				<div className="space-x-md flex items-center">
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
						className="btn-ghost p-md !hidden md:!inline-flex"
					>
						<RefreshCw
							className={cn(
								"size-lg",
								isLoadingCoinDetail && "animate-spin",
							)}
						/>
					</Clickable>

					<Clickable
						onClick={() => toggleFavorite(selectedCoin)}
						className={cn(
							"p-md rounded-xl",
							isFavorite
								? "bg-primary-600 shadow-primary-500/25 shadow-lg"
								: "btn-ghost",
						)}
					>
						<Star
							className={cn(
								"size-lg",
								isFavorite && "fill-current",
							)}
						/>
					</Clickable>
				</div>
			</div>

			{/* Price Section */}
			<div className="glass-effect p-xl space-y-lg rounded-xl">
				{/* Price Header */}
				<div className="flex items-start justify-between">
					<div className="space-y-sm">
						<div className="text-4xl font-bold lg:text-6xl">
							<AnimatedNumber value={currentPrice} prefix="$" />
						</div>
						<div
							className={cn(
								"text-lg-responsive gap-xs flex items-center",
								isPositive
									? "text-content-positive"
									: "text-content-negative",
							)}
						>
							{isPositive ? (
								<TrendingUp className="size-md" />
							) : (
								<TrendingDown className="size-md" />
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
						<div className="text-content-secondary text-sm-responsive hidden md:block">
							Market Cap Rank
						</div>
						<div className="text-2xl font-bold text-white lg:text-4xl">
							#{coinDetail.market_cap_rank}
						</div>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="gap-lg grid grid-cols-2 md:grid-cols-4">
					<div className="glass-effect p-lg space-y-xs rounded-xl text-center">
						<div className="text-content-secondary text-sm-responsive">
							24h High
						</div>
						<div className="text-lg-responsive font-semibold">
							<AnimatedNumber
								value={coinDetail.market_data?.high_24h?.usd}
								prefix="$"
							/>
						</div>
					</div>
					<div className="glass-effect p-lg space-y-xs rounded-xl text-center">
						<div className="text-content-secondary text-sm-responsive">
							24h Low
						</div>
						<div className="text-lg-responsive font-semibold">
							<AnimatedNumber
								value={coinDetail.market_data?.low_24h?.usd}
								prefix="$"
							/>
						</div>
					</div>
					<div className="glass-effect p-lg space-y-xs rounded-xl text-center">
						<div className="text-content-secondary text-sm-responsive">
							Market Cap
						</div>
						<div className="text-lg-responsive font-semibold">
							<AnimatedNumber
								value={coinDetail.market_data?.market_cap?.usd}
								prefix="$"
							/>
						</div>
					</div>
					<div className="glass-effect p-lg space-y-xs rounded-xl text-center">
						<div className="text-content-secondary text-sm-responsive">
							Volume
						</div>
						<div className="text-lg-responsive font-semibold">
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
			<div className="glass-effect p-xl space-y-xl rounded-xl">
				{/* Chart Header */}
				<div className="gap-md flex flex-col items-center justify-between md:flex-row">
					<h2 className="text-xl-responsive font-semibold">
						Price Chart
					</h2>
					<div className="space-x-sm flex">
						{ENV_CONFIG.CHART_PERIODS.map((period) => (
							<Clickable
								key={period.value}
								onClick={() => setChartPeriod(period.value)}
								className={cn(
									"text-sm-responsive px-md py-xs rounded-lg",
									chartPeriod === period.value
										? "btn-primary"
										: "btn-ghost",
								)}
								layout
								disabled={isLoadingChartData}
							>
								{period.label}
							</Clickable>
						))}
					</div>
				</div>

				<div className="h-10xl relative">
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
			<div className="gap-xl grid grid-cols-1 xl:grid-cols-2">
				{/* Market Stats */}
				<div className="glass-effect p-xl space-y-lg rounded-xl">
					<h3 className="text-lg-responsive space-x-xs align-middle font-semibold">
						<BarChart3 className="size-md inline" />
						<span>Market Statistics</span>
					</h3>
					<div className="space-y-lg">
						<div className="flex justify-between">
							<span className="text-content-secondary">
								Market Cap
							</span>
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
							<span className="text-content-secondary">
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
							<span className="text-content-secondary">
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
							<span className="text-content-secondary">
								Total Supply
							</span>
							<span>
								<AnimatedNumber
									value={coinDetail.market_data?.total_supply}
									prefix="$"
								/>
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-content-secondary">
								Max Supply
							</span>
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
				<div className="glass-effect p-xl space-y-lg flex flex-col rounded-xl">
					<h3 className="text-lg-responsive space-x-xs align-middle font-semibold">
						<Activity className="size-md inline" />
						<span>Price History</span>
					</h3>
					<div className="space-y-lg flex grow flex-col">
						<div className="flex justify-between">
							<div className="flex flex-col">
								<span>All-Time High</span>
								<span className="text-content-secondary font-medium">
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
										"text-sm-responsive space-x-xs align-middle",
										(coinDetail.market_data
											?.ath_change_percentage?.usd || 0) >
											0
											? "text-content-positive"
											: "text-content-negative",
									)}
								>
									{(coinDetail.market_data
										?.ath_change_percentage?.usd || 0) >
									0 ? (
										<TrendingUp className="size-sm inline" />
									) : (
										<TrendingDown className="size-sm inline" />
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
								<span className="text-content-secondary">
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
										"text-sm-responsive space-x-xs align-middle",
										(coinDetail.market_data
											?.atl_change_percentage?.usd || 0) >
											0
											? "text-content-positive"
											: "text-content-negative",
									)}
								>
									{(coinDetail.market_data
										?.atl_change_percentage?.usd || 0) >
									0 ? (
										<TrendingUp className="size-sm inline" />
									) : (
										<TrendingDown className="size-sm inline" />
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
							<span className="text-content-secondary">
								Last Updated
							</span>
							<span>{formatDate(coinDetail.last_updated)}</span>
						</div>
					</div>
				</div>
			</div>

			{/* ROI Section */}
			{coinDetail.market_data?.roi && (
				<div className="glass-effect p-xl space-y-lg rounded-xl">
					<h3 className="text-lg-responsive space-x-xs align-middle font-semibold">
						<DollarSign className="size-md inline" />
						<span>Return on Investment</span>
					</h3>
					<div className="gap-lg grid grid-cols-1 md:grid-cols-3">
						<div className="glass-effect p-lg rounded-xl text-center">
							<div className="text-content-positive text-2xl-responsive font-bold">
								<AnimatedNumber
									value={coinDetail.market_data?.roi?.times}
									suffix="x"
								/>
							</div>
							<div className="text-content-secondary text-sm-responsive">
								ROI Multiple
							</div>
						</div>
						<div className="glass-effect p-lg rounded-xl text-center">
							<div className="text-content-positive text-2xl-responsive font-bold">
								<AnimatedNumber
									value={
										coinDetail.market_data?.roi?.percentage
									}
									suffix="%"
									decimals={1}
									simplified={false}
								/>
							</div>
							<div className="text-content-secondary text-sm-responsive">
								ROI Percentage
							</div>
						</div>
						<div className="glass-effect p-lg rounded-xl text-center">
							<div className="text-2xl-responsive font-bold">
								{coinDetail.market_data?.roi?.currency?.toUpperCase()}
							</div>
							<div className="text-content-secondary text-sm-responsive">
								Base Currency
							</div>
						</div>
					</div>
				</div>
			)}
		</motion.div>
	);
};
