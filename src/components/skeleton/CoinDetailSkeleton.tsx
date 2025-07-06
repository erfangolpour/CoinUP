import { motion } from "motion/react";

export const CoinDetailSkeleton = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="space-y-6"
	>
		{/* Header Skeleton */}
		<div className="mb-6 flex items-center space-x-4">
			<div className="h-8 w-8 animate-pulse rounded-full bg-slate-700"></div>
			<div className="h-8 w-32 animate-pulse rounded bg-slate-700"></div>
		</div>

		{/* Content Skeleton */}
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div className="space-y-4">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="animate-pulse rounded-xl bg-slate-800/50 p-6"
					>
						<div className="mb-2 h-6 rounded bg-slate-700"></div>
						<div className="h-4 w-3/4 rounded bg-slate-700"></div>
					</div>
				))}
			</div>
			<div className="animate-pulse rounded-xl bg-slate-800/50 p-6">
				<div className="h-64 rounded bg-slate-700"></div>
			</div>
		</div>
	</motion.div>
);
