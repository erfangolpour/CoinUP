import { useState, useEffect } from "react";
import { useStore } from "@stores/useStore";
import type { SortType } from "@/types/crypto";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@utils/cn";
import {
  ArrowUpDown,
  Filter,
  RefreshCw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { CoinCard } from "@components/CoinCard";
import { CoinCardSkeleton } from "@/components/skeleton/CoinCardSkeleton";
import Timer from "@/components/common/Timer";
import Clickable from "./common/Clickable";

export const CoinList: React.FC = () => {
  const {
    coins,
    loadCoins,
    searchQuery,
    getFilteredCoins,
    sortType,
    setSortType,
    sortOrder,
    setSortOrder,
    isLoadingCoins: isLoading,
    listLastUpdated,
  } = useStore();

  const REFRESH_INTERVAL = 30000; // 30 seconds
  const filteredCoins = getFilteredCoins();
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
    }, REFRESH_INTERVAL);

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
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        <div className="w-full space-y-3">
          <h1 className="text-3xl lg:text-4xl font-bold">
            Cryptocurrency Tracker
          </h1>
          <p className="text-slate-400 text-lg">
            {searchQuery
              ? `Showing ${filteredCoins.length} result
                ${filteredCoins.length === 1 ? "" : "s"} for "${searchQuery}"`
              : `Tracking ${coins.length} cryptocurrencies`}
          </p>
        </div>

        <div className="flex justify-between lg:justify-end w-full items-center space-x-4 lg:space-x-6">
          {/* Last Updated */}
          <Timer
            lastUpdated={listLastUpdated}
            refreshInterval={REFRESH_INTERVAL}
            className="text-left lg:text-right"
          />

          <div className="flex gap-3">
            {/* Refresh Button */}
            <Clickable
              onClick={() => loadCoins()}
              disabled={isLoading}
              className="p-3 lg:p-4 glass-effect hover:bg-slate-600/20 rounded-xl text-slate-300 hover:text-white"
            >
              <RefreshCw
                className={cn(
                  "w-4 h-4 lg:w-5 lg:h-5",
                  isLoading && "animate-spin"
                )}
              />
            </Clickable>

            {/* Sort & Filter */}
            <Clickable
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 lg:px-6 lg:py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25"
            >
              <Filter className="w-4 h-4 lg:w-5 lg:h-5" />
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
            <div className="glass-effect rounded-xl p-6 flex flex-col md:flex-row justify-between gap-5">
              {/* Sort Type */}
              <div className="flex flex-wrap gap-3 lg:gap-4">
                {sortTypeOptions.map((option) => (
                  <Clickable
                    key={option.value}
                    onClick={() => setSortType(option.value)}
                    className={cn(
                      "px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-sm lg:text-base font-medium",
                      sortType === option.value
                        ? "bg-blue-600 shadow-lg shadow-blue-500/25"
                        : "glass-effect text-slate-300 hover:bg-slate-600/20 hover:text-white"
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
                    "flex items-center space-x-2 px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-sm lg:text-base font-medium",
                    sortOrder === "desc"
                      ? "bg-blue-600 shadow-lg shadow-blue-500/25"
                      : "glass-effect text-slate-300 hover:bg-slate-600/20 hover:text-white"
                  )}
                >
                  <ChevronDown className="w-4 h-4" />
                  <span>{sortType === "name" ? "Z to A" : "High to Low"}</span>
                </Clickable>
                <Clickable
                  onClick={() => setSortOrder("asc")}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-sm lg:text-base font-medium",
                    sortOrder === "asc"
                      ? "bg-blue-600 shadow-lg shadow-blue-500/25"
                      : "glass-effect text-slate-300 hover:bg-slate-600/20 hover:text-white"
                  )}
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>{sortType === "name" ? "A to Z" : "Low to High"}</span>
                </Clickable>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coin Grid with Skeleton */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading && coins.length === 0
            ? // Loading Placeholder with shared layoutId
              [...Array(15)].map((_, i) => <CoinCardSkeleton key={i} />)
            : // Actual coin cards with shared layoutId
              filteredCoins.map((coin) => (
                <CoinCard key={coin.id} coin={coin} searchQuery={searchQuery} />
              ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredCoins.length === 0 && searchQuery && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-slate-400 mb-4">
            <ArrowUpDown className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No cryptocurrencies found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
