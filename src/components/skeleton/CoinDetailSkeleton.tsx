import { motion } from "motion/react";

export const CoinDetailSkeleton = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="space-y-2xl"
	>
		{/* Header Skeleton */}
		<div className="flex items-center justify-between">
			<div className="space-x-lg flex items-center">
				<div className="bg-surface-700 size-6 animate-pulse rounded-full"></div>
				<div className="space-x-lg flex items-center">
					<div className="glass-effect bg-surface-700 size-5xl animate-pulse rounded-full"></div>
					<div className="space-y-1">
						<div className="bg-surface-700 w-32 h-8 animate-pulse rounded lg:h-12 lg:w-40"></div>
						<div className="bg-surface-700 h-5 w-16 animate-pulse rounded lg:h-6 lg:w-20"></div>
					</div>
				</div>
			</div>
			<div className="space-x-md flex items-center">
				<div className="bg-surface-700 size-4xl animate-pulse rounded-xl"></div>
				<div className="bg-surface-700 size-4xl animate-pulse rounded-xl"></div>
			</div>
		</div>

		{/* Price Section Skeleton */}
		<div className="glass-effect p-xl space-y-lg rounded-xl backdrop-blur-sm">
			<div className="flex items-start justify-between">
				<div className="space-y-sm">
					<div className="bg-surface-700 h-12 w-32 animate-pulse rounded lg:h-16 lg:w-40"></div>
					<div className="bg-surface-700 h-6 w-24 animate-pulse rounded lg:h-7 lg:w-28"></div>
				</div>
				<div className="text-right">
					<div className="bg-surface-700 h-5 w-28 animate-pulse rounded hidden md:block"></div>
					<div className="bg-surface-700 h-8 w-16 animate-pulse rounded lg:h-10 lg:w-20"></div>
				</div>
			</div>

			{/* Quick Stats Skeleton */}
			<div className="gap-lg grid grid-cols-2 md:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="glass-effect p-lg space-y-xs rounded-xl text-center"
					>
						<div className="bg-surface-700 h-5 w-16 animate-pulse rounded"></div>
						<div className="bg-surface-700 h-6 w-20 animate-pulse rounded"></div>
					</div>
				))}
			</div>
		</div>

		{/* Chart Section Skeleton */}
		<div className="glass-effect p-xl space-y-xl rounded-xl backdrop-blur-sm">
			<div className="gap-md flex flex-col items-center justify-between md:flex-row">
				<div className="bg-surface-700 h-6 w-24 animate-pulse rounded lg:h-7 lg:w-28"></div>
				<div className="space-x-sm flex">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="bg-surface-700 h-8 w-12 animate-pulse rounded-lg lg:h-10 lg:w-16"
						></div>
					))}
				</div>
			</div>
			<div className="bg-surface-700 h-64 animate-pulse rounded-xl lg:h-80"></div>
		</div>

		{/* Detailed Stats Skeleton */}
		<div className="gap-xl grid grid-cols-1 xl:grid-cols-2">
			{/* Market Stats Skeleton */}
			<div className="glass-effect p-xl space-y-lg rounded-xl backdrop-blur-sm">
				<div className="flex items-center">
					<div className="bg-surface-700 mr-2 h-5 w-5 animate-pulse rounded lg:h-6 lg:w-6"></div>
					<div className="bg-surface-700 h-6 w-32 animate-pulse rounded lg:h-7 lg:w-40"></div>
				</div>
				<div className="space-y-lg">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="flex justify-between">
							<div className="bg-surface-700 h-5 w-28 animate-pulse rounded"></div>
							<div className="bg-surface-700 h-5 w-20 animate-pulse rounded"></div>
						</div>
					))}
				</div>
			</div>

			{/* Price History Skeleton */}
			<div className="glass-effect p-xl space-y-lg flex flex-col rounded-xl backdrop-blur-sm">
				<div className="flex items-center">
					<div className="bg-surface-700 mr-2 h-5 w-5 animate-pulse rounded lg:h-6 lg:w-6"></div>
					<div className="bg-surface-700 h-6 w-24 animate-pulse rounded lg:h-7 lg:w-32"></div>
				</div>
				<div className="space-y-lg flex grow flex-col">
					{[...Array(2)].map((_, i) => (
						<div key={i} className="flex justify-between">
							<div className="flex flex-col">
								<div className="bg-surface-700 h-5 w-24 animate-pulse rounded"></div>
								<div className="bg-surface-700 h-4 w-20 animate-pulse rounded"></div>
							</div>
							<div className="text-right">
								<div className="bg-surface-700 h-5 w-20 animate-pulse rounded"></div>
								<div className="bg-surface-700 h-4 w-16 animate-pulse rounded"></div>
							</div>
						</div>
					))}
					<div className="flex grow items-end justify-between">
						<div className="bg-surface-700 h-4 w-20 animate-pulse rounded"></div>
						<div className="bg-surface-700 h-4 w-28 animate-pulse rounded"></div>
					</div>
				</div>
			</div>
		</div>
	</motion.div>
);
