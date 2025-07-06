import { motion } from "motion/react";

export const CoinDetailSkeleton = () => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="space-y-8 lg:space-y-12"
	>
		{/* Header Skeleton */}
		<div className="flex items-center justify-between">
			<div className="flex items-center space-x-4 lg:space-x-6">
				<div className="glass-effect h-10 w-10 animate-pulse rounded-xl bg-slate-700 lg:h-12 lg:w-12"></div>
				<div className="flex items-center space-x-4 lg:space-x-6">
					<div className="glass-effect h-16 w-16 animate-pulse rounded-full bg-slate-700 lg:h-20 lg:w-20"></div>
					<div>
						<div className="mb-2 h-8 w-48 animate-pulse rounded bg-slate-700 lg:h-12 lg:w-64"></div>
						<div className="h-6 w-16 animate-pulse rounded bg-slate-700 lg:h-8 lg:w-20"></div>
					</div>
				</div>
			</div>
			<div className="flex items-center space-x-4">
				<div className="glass-effect h-12 w-12 animate-pulse rounded-xl bg-slate-700 lg:h-16 lg:w-16"></div>
				<div className="glass-effect h-12 w-12 animate-pulse rounded-xl bg-slate-700 lg:h-16 lg:w-16"></div>
			</div>
		</div>

		{/* Price Section Skeleton */}
		<div className="glass-effect rounded-xl p-6 backdrop-blur-sm lg:p-8">
			<div className="mb-6 flex items-start justify-between lg:mb-8">
				<div>
					<div className="mb-3 h-12 w-48 animate-pulse rounded bg-slate-700 lg:h-16 lg:w-64"></div>
					<div className="h-6 w-32 animate-pulse rounded bg-slate-700 lg:h-8 lg:w-40"></div>
				</div>
				<div className="text-right">
					<div className="mb-2 h-4 w-24 animate-pulse rounded bg-slate-700 lg:h-5 lg:w-32"></div>
					<div className="h-8 w-16 animate-pulse rounded bg-slate-700 lg:h-10 lg:w-20"></div>
				</div>
			</div>

			{/* Quick Stats Skeleton */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="glass-effect rounded-xl p-4 text-center lg:p-6"
					>
						<div className="mb-2 h-4 w-16 animate-pulse rounded bg-slate-700 lg:h-5 lg:w-20"></div>
						<div className="h-6 w-20 animate-pulse rounded bg-slate-700 lg:h-7 lg:w-24"></div>
					</div>
				))}
			</div>
		</div>

		{/* Chart Section Skeleton */}
		<div className="glass-effect rounded-xl p-6 backdrop-blur-sm lg:p-8">
			<div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row lg:mb-8">
				<div className="h-6 w-32 animate-pulse rounded bg-slate-700 lg:h-8 lg:w-40"></div>
				<div className="flex space-x-2 lg:space-x-3">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="h-8 w-12 animate-pulse rounded-lg bg-slate-700 lg:h-10 lg:w-16"
						></div>
					))}
				</div>
			</div>
			<div className="h-64 animate-pulse rounded-xl bg-slate-700 lg:h-80"></div>
		</div>

		{/* Detailed Stats Skeleton */}
		<div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-2">
			{/* Market Stats Skeleton */}
			<div className="glass-effect rounded-xl p-6 backdrop-blur-sm lg:p-8">
				<div className="mb-4 flex items-center lg:mb-6">
					<div className="mr-2 h-5 w-5 animate-pulse rounded bg-slate-700 lg:h-6 lg:w-6"></div>
					<div className="h-6 w-40 animate-pulse rounded bg-slate-700 lg:h-7 lg:w-48"></div>
				</div>
				<div className="space-y-4 lg:space-y-6">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="flex justify-between">
							<div className="h-5 w-32 animate-pulse rounded bg-slate-700"></div>
							<div className="h-5 w-24 animate-pulse rounded bg-slate-700"></div>
						</div>
					))}
				</div>
			</div>

			{/* Price History Skeleton */}
			<div className="glass-effect flex flex-col rounded-xl p-6 backdrop-blur-sm lg:p-8">
				<div className="mb-4 flex items-center lg:mb-6">
					<div className="mr-2 h-5 w-5 animate-pulse rounded bg-slate-700 lg:h-6 lg:w-6"></div>
					<div className="h-6 w-32 animate-pulse rounded bg-slate-700 lg:h-7 lg:w-40"></div>
				</div>
				<div className="flex grow flex-col space-y-4 lg:space-y-6">
					{[...Array(2)].map((_, i) => (
						<div key={i} className="flex justify-between">
							<div className="flex flex-col space-y-2">
								<div className="h-5 w-28 animate-pulse rounded bg-slate-700"></div>
								<div className="h-4 w-20 animate-pulse rounded bg-slate-700"></div>
							</div>
							<div className="text-right">
								<div className="mb-2 h-5 w-20 animate-pulse rounded bg-slate-700"></div>
								<div className="h-4 w-16 animate-pulse rounded bg-slate-700"></div>
							</div>
						</div>
					))}
					<div className="flex grow items-end justify-between">
						<div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
						<div className="h-4 w-32 animate-pulse rounded bg-slate-700"></div>
					</div>
				</div>
			</div>
		</div>
	</motion.div>
);
