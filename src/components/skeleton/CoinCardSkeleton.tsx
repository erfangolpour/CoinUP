import { motion } from "motion/react";

export const CoinCardSkeleton = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="glass-effect relative animate-pulse rounded-xl border border-slate-700/50 p-6 lg:p-8"
	>
		{/* Favorite Button Skeleton */}
		<div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-700"></div>

		{/* Header */}
		<div className="mb-6 flex items-center space-x-4">
			<div className="h-12 w-12 rounded-full bg-slate-700 lg:h-16 lg:w-16"></div>
			<div className="flex-1">
				<div className="mb-2 h-5 w-3/4 rounded bg-slate-700 lg:h-6"></div>
				<div className="h-3 w-16 rounded bg-slate-700 lg:h-4"></div>
			</div>
		</div>

		{/* Price */}
		<div className="mb-6">
			<div className="mb-2 h-8 w-1/2 rounded bg-slate-700 lg:h-10"></div>
			<div className="h-4 w-1/3 rounded bg-slate-700"></div>
		</div>

		{/* Stats */}
		<div className="grid grid-cols-2 gap-4">
			<div>
				<div className="mb-2 h-3 w-full rounded bg-slate-700"></div>
				<div className="h-4 w-3/4 rounded bg-slate-700"></div>
			</div>
			<div>
				<div className="mb-2 h-3 w-full rounded bg-slate-700"></div>
				<div className="h-4 w-3/4 rounded bg-slate-700"></div>
			</div>
		</div>

		{/* Volume and Market Cap */}
		<div className="mt-4 grid grid-cols-2 gap-4">
			<div>
				<div className="mb-2 h-3 w-full rounded bg-slate-700"></div>
				<div className="h-4 w-2/3 rounded bg-slate-700"></div>
			</div>
			<div>
				<div className="mb-2 h-3 w-full rounded bg-slate-700"></div>
				<div className="h-4 w-2/3 rounded bg-slate-700"></div>
			</div>
		</div>
	</motion.div>
);
