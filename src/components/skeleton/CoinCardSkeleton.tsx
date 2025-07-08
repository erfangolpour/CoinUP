import { motion } from "motion/react";

export const CoinCardSkeleton = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="glass-effect border-surface-700/50 space-y-lg relative animate-pulse rounded-xl border p-6"
	>
		{/* Coin Header */}
		<div className="flex items-start justify-between">
			<div className="space-x-lg flex items-center">
				<div className="glass-effect bg-surface-700 size-4xl rounded-full"></div>{" "}
				<div className="flex-1 space-y-1">
					<div className="bg-surface-700 h-lg w-24 rounded"></div>
					<div className="bg-surface-700 h-sm w-12 rounded"></div>
				</div>
			</div>
			{/* Favorite Button */}
			<div className="glass-effect bg-surface-700 p-sm size-2xl rounded-full"></div>
		</div>

		{/* Price */}
		<div className="space-y-xs">
			<div className="bg-surface-700 h-2xl w-28 rounded"></div>
			<div className="bg-surface-700 h-md w-20 rounded"></div>
		</div>

		{/* Stats */}
		<div className="gap-lg text-sm-responsive grid grid-cols-2">
			<div className="space-y-xs">
				<div className="bg-surface-700 h-sm w-20 rounded"></div>
				<div className="bg-surface-700 h-md w-16 rounded"></div>
			</div>
			<div className="space-y-xs">
				<div className="bg-surface-700 h-sm w-18 rounded"></div>
				<div className="bg-surface-700 h-md w-16 rounded"></div>
			</div>
			<div className="space-y-xs">
				<div className="bg-surface-700 h-sm w-14 rounded"></div>
				<div className="bg-surface-700 h-md w-16 rounded"></div>
			</div>
			<div className="space-y-xs">
				<div className="bg-surface-700 h-sm w-14 rounded"></div>
				<div className="bg-surface-700 h-md w-16 rounded"></div>
			</div>
		</div>
	</motion.div>
);
