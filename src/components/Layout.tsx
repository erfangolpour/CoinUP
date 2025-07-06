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
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
			{/* Header */}
			<motion.header
				className="glass-effect sticky top-0 z-50 backdrop-blur-md"
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className="container mx-auto px-4 py-4 lg:px-0 lg:py-6">
					<div className="flex items-center justify-between gap-10">
						{/* Logo */}
						<Clickable
							className="flex items-center space-x-3"
							onClick={() => setSelectedCoin(null)}
						>
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 lg:h-10 lg:w-10">
								<TrendingUp className="h-5 w-5 text-white lg:h-6 lg:w-6" />
							</div>
							<span className="text-xl font-bold text-white lg:text-2xl">
								CoinUP
							</span>
						</Clickable>

						{/* Search Bar */}
						<div className="max-w-xl flex-1">
							<div className="relative">
								<Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
								<input
									type="text"
									placeholder="Search"
									value={localSearchQuery}
									onChange={(e) =>
										setLocalSearchQuery(e.target.value)
									}
									onFocus={() => setSelectedCoin(null)}
									className="w-full rounded-xl border border-slate-600 bg-slate-800/50 py-3 pr-4 pl-12 placeholder-slate-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none lg:py-4"
								/>
							</div>
						</div>
					</div>
				</div>
			</motion.header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8 lg:px-0 lg:py-12">
				{children}
			</main>
		</div>
	);
};
