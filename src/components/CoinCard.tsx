import type { Coin } from "@/types/crypto";
import AnimatedNumber from "@components/common/AnimatedNumber";
import Clickable from "@components/common/Clickable";
import { useStore } from "@stores/useStore";
import { cn } from "@utils/cn";
import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

interface CoinCardProps {
	coin: Coin;
	searchQuery?: string;
}

const HighlightText = memo(
	({ text, query }: { text: string; query: string }) => {
		const highlightedText = useMemo(() => {
			if (!query) return text;

			const regex = new RegExp(`(${query})`, "gi");
			const parts = text.split(regex);
			return parts.map((part, index) =>
				part.toLowerCase() === query.toLowerCase() ? (
					<span
						key={index}
						className="rounded bg-blue-500/30 text-blue-200"
					>
						{part}
					</span>
				) : (
					part
				),
			);
		}, [text, query]);

		return <>{highlightedText}</>;
	},
	// Optimize re-renders for HighlightText
	(prevProps, nextProps) =>
		prevProps.text === nextProps.text &&
		prevProps.query === nextProps.query,
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
			[coin.id, toggleFavorite],
		);

		return (
			<Clickable
				layout
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				whileHover={{ scale: 1.02, y: -8 }}
				transition={{
					layout: { duration: 0.3, ease: "easeInOut", type: "tween" },
					opacity: { duration: 0.2, type: "tween" },
					scale: { duration: 0.1, type: "tween" },
					y: { duration: 0.1, type: "tween" },
				}}
				className={cn(
					"glass-effect relative rounded-xl border p-6",
					isFavorite
						? "border-blue-500/50 shadow-lg shadow-blue-500/20"
						: "border-slate-700/50 hover:border-slate-600/50",
				)}
				onClick={handleCardClick}
			>
				{/* Favorite Indicator */}
				{isFavorite && (
					<div className="absolute top-0 left-0 h-1 w-full rounded-t-xl bg-gradient-to-r from-blue-500 to-purple-500"></div>
				)}

				{/* Coin Header */}
				<div className="flex items-start justify-between">
					<div className="mb-6 flex items-center space-x-4 lg:space-x-6">
						<div className="glass-effect flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
							<img
								src={coin.image}
								alt={coin.name}
								className="h-12 w-12 object-cover"
								onError={(e) => {
									e.currentTarget.style.display = "none";
								}}
							/>
						</div>
						<div className="flex-1 space-y-1">
							<h3 className="text-xl font-semibold">
								<HighlightText
									text={coin.name}
									query={searchQuery}
								/>
							</h3>
							<p className="text-slate-400 uppercase">
								<HighlightText
									text={coin.symbol}
									query={searchQuery}
								/>
							</p>
						</div>
					</div>

					{/* Favorite Button */}
					<Clickable
						className={cn(
							"rounded-full p-2 hover:text-white lg:p-3",
							{
								"bg-blue-600 shadow-lg shadow-blue-500/25":
									isFavorite,
								"glass-effect text-slate-400 hover:bg-slate-600/20":
									!isFavorite,
							},
						)}
						onClick={handleFavoriteClick}
					>
						<Star
							className="h-5 w-5"
							fill={isFavorite ? "currentColor" : "none"}
						/>
					</Clickable>
				</div>

				{/* Price */}
				<div className="mb-6">
					<div className="mb-2 text-2xl font-bold lg:text-3xl">
						<AnimatedNumber value={coin.current_price} prefix="$" />
					</div>
					<div
						className={cn(
							"flex items-center text-sm lg:text-base",
							isPositive ? "text-green-400" : "text-red-400",
						)}
					>
						{isPositive ? (
							<TrendingUp className="mr-1 h-4 w-4 lg:h-5 lg:w-5" />
						) : (
							<TrendingDown className="mr-1 h-4 w-4 lg:h-5 lg:w-5" />
						)}
						<AnimatedNumber
							value={Math.abs(coin.price_change_percentage_24h)}
							suffix="%"
						/>
						<span className="ml-1">(24h)</span>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 gap-4 text-sm lg:gap-6 lg:text-base">
					<div>
						<p className="mb-1 text-slate-400 lg:mb-2">
							Market Cap
						</p>
						<p>
							<AnimatedNumber
								value={coin.market_cap}
								prefix="$"
							/>
						</p>
					</div>
					<div>
						<p className="mb-1 text-slate-400 lg:mb-2">
							24h Volume
						</p>
						<p>
							<AnimatedNumber
								value={coin.total_volume}
								prefix="$"
							/>
						</p>
					</div>
					<div>
						<p className="mb-1 text-slate-400 lg:mb-2">24h High</p>
						<p>
							<AnimatedNumber value={coin.high_24h} prefix="$" />
						</p>
					</div>
					<div>
						<p className="mb-1 text-slate-400 lg:mb-2">24h Low</p>
						<p>
							<AnimatedNumber value={coin.low_24h} prefix="$" />
						</p>
					</div>
				</div>
			</Clickable>
		);
	},
	// Optimized comparison function - only check essential props
	(prevProps, nextProps) => {
		const { coin: prevCoin, searchQuery: prevQuery } = prevProps;
		const { coin: nextCoin, searchQuery: nextQuery } = nextProps;

		// Quick reference check first
		if (prevCoin === nextCoin && prevQuery === nextQuery) {
			return true;
		}

		// Check only the essential fields that affect rendering
		return (
			prevCoin.id === nextCoin.id &&
			prevCoin.current_price === nextCoin.current_price &&
			prevCoin.price_change_percentage_24h ===
				nextCoin.price_change_percentage_24h &&
			prevCoin.market_cap === nextCoin.market_cap &&
			prevCoin.total_volume === nextCoin.total_volume &&
			prevCoin.high_24h === nextCoin.high_24h &&
			prevCoin.low_24h === nextCoin.low_24h &&
			prevQuery === nextQuery
		);
	},
);
