import { memo, useCallback, useMemo } from "react";
import { useStore } from "@stores/useStore";
import { cn } from "@utils/cn";
import Clickable from "@components/common/Clickable";
import AnimatedNumber from "@components/common/AnimatedNumber";
import type { Coin } from "@/types/crypto";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

interface CoinCardProps {
  coin: Coin;
  searchQuery?: string;
}

const HighlightText = memo(
  ({ text, query }: { text: string; query: string }) => {
    const highlightedText = useMemo(() => {
      if (!query) return text;

      const parts = text.split(new RegExp(`(${query})`, "gi"));
      return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={index}
            className="bg-blue-500/30 text-blue-200 px-1 rounded"
          >
            {part}
          </span>
        ) : (
          part
        )
      );
    }, [text, query]);

    return <>{highlightedText}</>;
  }
);

export const CoinCard: React.FC<CoinCardProps> = memo(
  ({ coin, searchQuery = "" }) => {
    const { favorites, toggleFavorite, setSelectedCoin } = useStore();
    const isFavorite = favorites.includes(coin.id);
    const isPositive = coin.price_change_percentage_24h > 0;

    // Memoize click handlers
    const handleCardClick = useCallback(() => {
      setSelectedCoin(coin.id);
    }, [coin.id, setSelectedCoin]);

    const handleFavoriteClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(coin.id);
      },
      [coin.id, toggleFavorite]
    );

    return (
      <Clickable
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{
          layout: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.2 },
          scale: { duration: 0.1 },
          y: { duration: 0.1 },
        }}
        className={cn(
          "glass-effect relative p-6 rounded-xl border",
          isFavorite
            ? "border-blue-500/50 shadow-lg shadow-blue-500/20"
            : "border-slate-700/50 hover:border-slate-600/50"
        )}
        onClick={handleCardClick}
      >
        {/* Favorite Indicator */}
        {isFavorite && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"></div>
        )}

        {/* Coin Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 lg:space-x-6 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden glass-effect flex items-center justify-center">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-12 h-12 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-semibold">
                <HighlightText text={coin.name} query={searchQuery} />
              </h3>
              <p className="text-slate-400 uppercase">
                <HighlightText text={coin.symbol} query={searchQuery} />
              </p>
            </div>
          </div>

          {/* Favorite Button */}
          <Clickable
            className={cn("p-2 lg:p-3 rounded-full hover:text-white", {
              "bg-blue-600 shadow-lg shadow-blue-500/25": isFavorite,
              "glass-effect text-slate-400 hover:bg-slate-600/20": !isFavorite,
            })}
            onClick={handleFavoriteClick}
          >
            <Star
              className="w-5 h-5"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </Clickable>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="text-2xl lg:text-3xl font-bold mb-2">
            <AnimatedNumber value={coin.current_price} prefix="$" />
          </div>
          <div
            className={cn(
              "flex items-center text-sm lg:text-base",
              isPositive ? "text-green-400" : "text-red-400"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
            )}
            <AnimatedNumber
              value={Math.abs(coin.price_change_percentage_24h)}
              suffix="%"
            />
            <span className="ml-1">(24h)</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:gap-6 text-sm lg:text-base">
          <div>
            <p className="text-slate-400 mb-1 lg:mb-2">Market Cap</p>
            <p>
              <AnimatedNumber value={coin.market_cap} prefix="$" />
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-1 lg:mb-2">24h Volume</p>
            <p>
              <AnimatedNumber value={coin.total_volume} prefix="$" />
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-1 lg:mb-2">24h High</p>
            <p>
              <AnimatedNumber value={coin.high_24h} prefix="$" />
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-1 lg:mb-2">24h Low</p>
            <p>
              <AnimatedNumber value={coin.low_24h} prefix="$" />
            </p>
          </div>
        </div>
      </Clickable>
    );
  },
  // Custom comparison function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    // Only re-render if these specific values have changed
    return (
      prevProps.coin.id === nextProps.coin.id &&
      prevProps.coin.current_price === nextProps.coin.current_price &&
      prevProps.coin.price_change_percentage_24h ===
        nextProps.coin.price_change_percentage_24h &&
      prevProps.coin.market_cap === nextProps.coin.market_cap &&
      prevProps.coin.total_volume === nextProps.coin.total_volume &&
      prevProps.coin.high_24h === nextProps.coin.high_24h &&
      prevProps.coin.low_24h === nextProps.coin.low_24h &&
      prevProps.searchQuery === nextProps.searchQuery
    );
  }
);
