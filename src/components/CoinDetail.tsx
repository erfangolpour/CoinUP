import { useState, useEffect } from "react";
import { useStore } from "@stores/useStore";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  RefreshCw,
} from "lucide-react";
import { PriceChart } from "@components/PriceChart";
import AnimatedNumber from "@components/common/AnimatedNumber";
import Timer from "@/components/common/Timer";
import Clickable from "./common/Clickable";
import { cn } from "@utils/cn";
import { formatDate } from "@/utils/formatters";
import { CoinDetailSkeleton } from "@components/skeleton/CoinDetailSkeleton";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[100vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

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

  const REFRESH_INTERVAL = Number(import.meta.env.VITE_REFRESH_INTERVAL);

  const chartPeriods = [
    { value: 7, label: "7D" },
    { value: 30, label: "30D" },
    { value: 90, label: "90D" },
    { value: 365, label: "1Y" },
  ];

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
    }, REFRESH_INTERVAL);

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
            className="p-2 lg:p-3 glass-effect hover:bg-slate-600/20 rounded-xl text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </Clickable>

          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden glass-effect flex items-center justify-center">
              <img
                src={coinDetail.image?.large}
                alt={coinDetail.name}
                className="w-12 h-12 lg:w-16 lg:h-16 object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white">
                {coinDetail.name}
              </h1>
              <p className="text-slate-400 uppercase text-lg lg:text-xl">
                {coinDetail.symbol}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Update Info */}
          <Timer
            lastUpdated={detailLastUpdated}
            refreshInterval={REFRESH_INTERVAL}
            className="text-right hidden md:block"
          />

          {/* Refresh Button */}
          <Clickable
            onClick={handleRefresh}
            disabled={isLoadingCoinDetail}
            className="hidden md:block p-3 lg:p-4 glass-effect hover:bg-slate-600/20 rounded-xl text-slate-300 hover:text-white"
          >
            <RefreshCw
              className={cn(
                "w-6 h-6 lg:w-7 lg:h-7",
                isLoadingCoinDetail && "animate-spin"
              )}
            />
          </Clickable>

          <Clickable
            onClick={() => toggleFavorite(selectedCoin)}
            className={cn(
              "p-3 lg:p-4 rounded-xl hover:text-white",
              isFavorite
                ? "bg-blue-600 shadow-lg shadow-blue-500/25"
                : "glass-effect text-slate-400 hover:bg-slate-600/20 "
            )}
          >
            <Star
              className={cn(
                "w-6 h-6 lg:w-7 lg:h-7",
                isFavorite && "fill-current"
              )}
            />
          </Clickable>
        </div>
      </div>

      {/* Price Section */}
      <div className="glass-effect rounded-xl p-6 lg:p-8 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-6 lg:mb-8">
          <div>
            <div className="text-4xl lg:text-6xl font-bold mb-3">
              <AnimatedNumber value={currentPrice} prefix="$" />
            </div>
            <div
              className={cn(
                "flex items-center text-lg lg:text-xl",
                isPositive ? "text-green-400" : "text-red-400"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
              ) : (
                <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
              )}
              <AnimatedNumber
                value={Math.abs(priceChange24h)}
                suffix="%"
                decimals={2}
              />
              <span className="ml-1">(24h)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm hidden md:block lg:text-base text-slate-400">
              Market Cap Rank
            </div>
            <div className="text-2xl lg:text-4xl font-bold text-white">
              #{coinDetail.market_cap_rank}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <div className="text-center p-4 lg:p-6 glass-effect rounded-xl">
            <div className="text-sm lg:text-base text-slate-400 mb-2">
              24h High
            </div>
            <div className="font-semibold text-lg lg:text-xl">
              <AnimatedNumber
                value={coinDetail.market_data?.high_24h?.usd}
                prefix="$"
              />
            </div>
          </div>
          <div className="text-center p-4 lg:p-6 glass-effect rounded-xl">
            <div className="text-sm lg:text-base text-slate-400 mb-2">
              24h Low
            </div>
            <div className="font-semibold text-lg lg:text-xl">
              <AnimatedNumber
                value={coinDetail.market_data?.low_24h?.usd}
                prefix="$"
              />
            </div>
          </div>
          <div className="text-center p-4 lg:p-6 glass-effect rounded-xl">
            <div className="text-sm lg:text-base text-slate-400 mb-2">
              Market Cap
            </div>
            <div className="font-semibold text-lg lg:text-xl">
              <AnimatedNumber
                value={coinDetail.market_data?.market_cap?.usd}
                prefix="$"
              />
            </div>
          </div>
          <div className="text-center p-4 lg:p-6 glass-effect rounded-xl">
            <div className="text-sm lg:text-base text-slate-400 mb-2">
              Volume
            </div>
            <div className="font-semibold text-lg lg:text-xl">
              <AnimatedNumber
                value={coinDetail.market_data?.total_volume?.usd}
                prefix="$"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-effect rounded-xl p-6 lg:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 lg:mb-8 gap-4">
          <h2 className="text-xl lg:text-2xl font-semibold text-white">
            Price Chart
          </h2>
          <div className="flex space-x-2 lg:space-x-3">
            {chartPeriods.map((period) => (
              <Clickable
                key={period.value}
                onClick={() => setChartPeriod(period.value)}
                className={cn(
                  "px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base transition-colors duration-200 hover:text-white",
                  chartPeriod === period.value
                    ? "bg-blue-600 shadow-lg shadow-blue-500/25"
                    : "glass-effect text-slate-400 hover:bg-slate-600/20"
                )}
                layout
                disabled={isLoadingChartData}
              >
                {period.label}
              </Clickable>
            ))}
          </div>
        </div>

        <div className="h-64 lg:h-80 relative">
          <AnimatePresence>
            {isLoadingChartData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col absolute inset-0 bg-black/10 items-center justify-center rounded-xl z-10"
              >
                <LoadingSpinner />
                <span className="text-lg font-semibold">Loading chart...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <PriceChart data={chartData} period={chartPeriod} />
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Market Stats */}
        <div className="glass-effect rounded-xl p-6 lg:p-8 backdrop-blur-sm">
          <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
            Market Statistics
          </h3>
          <div className="space-y-4 lg:space-y-6">
            <div className="flex justify-between">
              <span className="text-slate-400">Market Cap</span>
              <span>
                <AnimatedNumber
                  value={coinDetail.market_data?.market_cap?.usd}
                  prefix="$"
                />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fully Diluted Valuation</span>
              <span>
                <AnimatedNumber
                  value={coinDetail.market_data?.fully_diluted_valuation?.usd}
                  prefix="$"
                />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Circulating Supply</span>
              <span>
                <AnimatedNumber
                  value={coinDetail.market_data?.circulating_supply || 0}
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
        <div className="flex flex-col glass-effect rounded-xl p-6 lg:p-8 backdrop-blur-sm">
          <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 flex items-center">
            <Activity className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
            Price History
          </h3>
          <div className="grow flex flex-col space-y-4 lg:space-y-6">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span>All-Time High</span>
                <span className="font-medium text-slate-400">
                  {coinDetail.market_data?.ath_date?.usd
                    ? formatDate(coinDetail.market_data?.ath_date?.usd)
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
                    "text-sm",
                    (coinDetail.market_data?.ath_change_percentage?.usd || 0) >
                      0
                      ? "text-green-400"
                      : "text-red-400"
                  )}
                >
                  <AnimatedNumber
                    value={coinDetail.market_data?.ath_change_percentage?.usd}
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
                  {formatDate(coinDetail.market_data?.atl_date?.usd || "")}
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
                    "text-sm",
                    (coinDetail.market_data?.atl_change_percentage?.usd || 0) >
                      0
                      ? "text-green-400"
                      : "text-red-400"
                  )}
                >
                  <AnimatedNumber
                    value={coinDetail.market_data?.atl_change_percentage?.usd}
                    suffix="%"
                    decimals={1}
                    simplified={false}
                  />
                </div>
              </div>
            </div>
            <div className="flex text-sm justify-between grow items-end">
              <span className="text-slate-400">Last Updated</span>
              <span>{formatDate(coinDetail.last_updated)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      {coinDetail.market_data?.roi && (
        <div className="glass-effect rounded-xl p-6 lg:p-8 backdrop-blur-sm">
          <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 flex items-center">
            <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
            Return on Investment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="text-center p-4 lg:p-6 glass-effect rounded-xl">
              <div className="text-2xl lg:text-3xl font-bold text-green-400">
                <AnimatedNumber
                  value={coinDetail.market_data?.roi?.times}
                  suffix="x"
                />
              </div>
              <div className="text-sm lg:text-base text-slate-400">
                ROI Multiple
              </div>
            </div>
            <div className="text-center p-4 lg:p-6 glass-effect rounded-xl">
              <div className="text-2xl lg:text-3xl font-bold text-green-400">
                <AnimatedNumber
                  value={coinDetail.market_data?.roi?.percentage}
                  suffix="%"
                  decimals={1}
                />
              </div>
              <div className="text-sm lg:text-base text-slate-400">
                ROI Percentage
              </div>
            </div>
            <div className="text-center p-4 lg:p-6 glass-effect rounded-xl">
              <div className="text-2xl lg:text-3xl font-bold text-white">
                {coinDetail.market_data?.roi?.currency?.toUpperCase()}
              </div>
              <div className="text-sm lg:text-base text-slate-400">
                Base Currency
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
