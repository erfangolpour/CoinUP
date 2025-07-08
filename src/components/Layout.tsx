import Clickable from "@components/common/Clickable";
import { ENV_CONFIG } from "@config/env";
import { useDebounce } from "@hooks/useDebounce";
import { useStore } from "@stores/useStore";
import { Search, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LayoutProps {
	children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { searchQuery, setSearchQuery, setSelectedCoin } = useStore();
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

	return (
		<div className="from-surface-900 via-surface-800 to-surface-900 min-h-screen bg-gradient-to-br">
			{/* Header */}
			<motion.header
				className="glass-effect sticky top-0 z-50 backdrop-blur-md"
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className="py-lg container mx-auto px-4 lg:px-0">
					<div className="flex items-center justify-between gap-10">
						{/* Logo */}
						<Clickable
							className="space-x-sm flex items-center"
							onClick={() => setSelectedCoin(null)}
						>
							<div className="from-primary-500 to-secondary-600 size-2xl flex items-center justify-center rounded-lg bg-gradient-to-br">
								<TrendingUp className="size-md" />
							</div>
							<span className="text-xl-responsive font-bold">
								CoinUP
							</span>
						</Clickable>

						{/* Search Bar */}
						<div className="w-120">
							<div className="relative">
								<Search className="text-content-tertiary size-md absolute top-1/2 left-4 -translate-y-1/2 transform" />
								<input
									type="text"
									placeholder="Search cryptocurrencies..."
									value={localSearchQuery}
									onChange={(e) =>
										setLocalSearchQuery(e.target.value)
									}
									onFocus={() => setSelectedCoin(null)}
									className="border-surface-600 bg-surface-800/50 placeholder-text-tertiary focus:border-primary-500 focus:ring-primary-500/20 py-md w-full rounded-xl border pr-4 pl-12 text-ellipsis transition-all duration-200 focus:ring-2 focus:outline-none"
								/>
							</div>
						</div>
					</div>
				</div>
			</motion.header>

			{/* Main Content */}
			<main className="py-2xl container mx-auto px-4 lg:px-0">
				{children}
			</main>
		</div>
	);
};
