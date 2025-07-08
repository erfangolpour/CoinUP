import { useAuthStore } from "@/stores/useAuthStore";
import { useStore } from "@/stores/useCoinStore";
import type { Coin } from "@/types/coin";
import AnimatedNumber from "@components/common/AnimatedNumber";
import Clickable from "@components/common/Clickable";
import { cn } from "@utils/cn";
import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { memo, useMemo } from "react";
import { toast } from "react-toastify";

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
					<span key={index} className="bg-primary-500/30 rounded">
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
		const { setSelectedCoin } = useStore();
		const { getFavorites, toggleFavorite, isAuthenticated } =
			useAuthStore();
		const favorites = getFavorites();
		const isFavorite = favorites.includes(coin.id);
		const isPositive = coin.price_change_percentage_24h > 0;

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
					"glass-effect space-y-lg relative rounded-xl border p-6",
					isFavorite
						? "border-primary-500/50 shadow-primary-500/20 shadow-lg"
						: "border-surface-700/50 hover:border-surface-600/50",
				)}
				onClick={() => setSelectedCoin(coin.id)}
			>
				{/* Favorite Indicator */}
				{isFavorite && (
					<div className="from-primary-500 to-secondary-500 absolute top-0 left-0 h-1 w-full rounded-t-xl bg-gradient-to-r"></div>
				)}

				{/* Coin Header */}
				<div className="flex items-start justify-between">
					<div className="flex items-center space-x-3">
						<div className="glass-effect size-4xl flex items-center justify-center overflow-hidden rounded-full">
							<img
								src={coin.image}
								alt={coin.name}
								className="size-12 object-cover"
								onError={(e) => {
									e.currentTarget.style.display = "none";
								}}
							/>
						</div>
						<div className="flex-1">
							<h3 className="text-xl-responsive font-semibold">
								<HighlightText
									text={coin.name}
									query={searchQuery}
								/>
							</h3>
							<p className="text-content-secondary uppercase">
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
							"p-sm !rounded-full",
							isFavorite
								? "bg-primary-600 shadow-primary-500/25 text-slate-50 shadow-lg"
								: "btn-ghost",
						)}
						onClick={(e) => {
							e.stopPropagation();
							if (!isAuthenticated) {
								toast.info("Please login to add favorites");
								return;
							}
							toggleFavorite(coin.id);
						}}
					>
						<Star
							className="size-5"
							fill={isFavorite ? "currentColor" : "none"}
						/>
					</Clickable>
				</div>

				{/* Price */}
				<div className="space-y-xs">
					<div className="text-2xl-responsive font-bold">
						<AnimatedNumber value={coin.current_price} prefix="$" />
					</div>
					<div
						className={cn(
							"text-sm-responsive space-x-xs align-middle",
							isPositive ? "text-content-positive" : "text-content-negative",
						)}
					>
						{isPositive ? (
							<TrendingUp className="size-sm inline" />
						) : (
							<TrendingDown className="size-sm inline" />
						)}
						<AnimatedNumber
							value={Math.abs(coin.price_change_percentage_24h)}
							suffix="%"
							simplified={false}
						/>
						<span>(24h)</span>
					</div>
				</div>

				{/* Stats */}
				<div className="gap-lg text-sm-responsive grid grid-cols-2">
					<div className="space-y-xs">
						<p className="text-content-secondary">Market Cap</p>
						<p>
							<AnimatedNumber
								value={coin.market_cap}
								prefix="$"
							/>
						</p>
					</div>
					<div className="space-y-xs">
						<p className="text-content-secondary">24h Volume</p>
						<p>
							<AnimatedNumber
								value={coin.total_volume}
								prefix="$"
							/>
						</p>
					</div>
					<div className="space-y-xs">
						<p className="text-content-secondary">24h High</p>
						<p>
							<AnimatedNumber value={coin.high_24h} prefix="$" />
						</p>
					</div>
					<div className="space-y-xs">
						<p className="text-content-secondary">24h Low</p>
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
