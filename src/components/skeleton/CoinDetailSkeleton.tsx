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
				<div className="bg-surface-700 size-3xl animate-pulse rounded-lg"></div>
				<div className="space-x-lg flex items-center">
					<div className="glass-effect bg-surface-700 size-5xl animate-pulse rounded-full"></div>
					<div className="space-y-1">
						<div className="bg-surface-700 h-8 w-32 animate-pulse rounded lg:h-12 lg:w-40"></div>
						<div className="bg-surface-700 h-md w-16 animate-pulse rounded"></div>
					</div>
				</div>
			</div>
			<div className="space-x-md flex items-center">
				<div className="bg-surface-700 size-4xl hidden animate-pulse rounded-xl md:block"></div>
				<div className="bg-surface-700 size-4xl animate-pulse rounded-xl"></div>
			</div>
		</div>

		{/* Price Section Skeleton */}
		<div className="glass-effect p-xl space-y-lg rounded-xl">
			<div className="flex items-start justify-between">
				<div className="space-y-sm">
					<div className="bg-surface-700 h-4xl w-42 animate-pulse rounded"></div>
					<div className="bg-surface-700 h-lg w-24 animate-pulse rounded"></div>
				</div>
				<div className="space-y-sm flex flex-col items-end">
					<div className="bg-surface-700 h-md hidden w-28 animate-pulse rounded md:block"></div>
					<div className="bg-surface-700 h-2xl w-16 animate-pulse rounded"></div>
				</div>
			</div>

			{/* Quick Stats Skeleton */}
			<div className="gap-lg grid grid-cols-2 md:grid-cols-4">
				{" "}
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="glass-effect p-lg gap-xs flex flex-col items-center justify-center rounded-xl"
					>
						<div className="bg-surface-700 h-md w-16 animate-pulse rounded"></div>
						<div className="bg-surface-700 h-lg w-20 animate-pulse rounded"></div>
					</div>
				))}
			</div>
		</div>

		{/* Chart Section Skeleton */}
		<div className="glass-effect p-xl space-y-xl rounded-xl">
			<div className="gap-md flex flex-col items-center justify-between md:flex-row">
				<div className="bg-surface-700 h-lg w-24 animate-pulse rounded"></div>
				<div className="space-x-sm flex">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="bg-surface-700 h-2xl w-4xl animate-pulse rounded-lg"
						></div>
					))}
				</div>
			</div>
			<div className="bg-surface-700 h-10xl animate-pulse rounded-xl"></div>
		</div>

		{/* Detailed Stats Skeleton */}
		<div className="gap-xl grid grid-cols-1 xl:grid-cols-2">
			{/* Market Stats Skeleton */}
			<div className="glass-effect p-xl space-y-lg rounded-xl">
				<div className="flex items-center">
					<div className="bg-surface-700 size-md mr-2 animate-pulse rounded"></div>
					<div className="bg-surface-700 h-lg w-32 animate-pulse rounded"></div>
				</div>
				<div className="space-y-lg">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="flex justify-between">
							<div className="bg-surface-700 h-md w-28 animate-pulse rounded"></div>
							<div className="bg-surface-700 h-md w-20 animate-pulse rounded"></div>
						</div>
					))}
				</div>
			</div>

			{/* Price History Skeleton */}
			<div className="glass-effect p-xl space-y-lg flex flex-col rounded-xl">
				<div className="flex items-center">
					<div className="bg-surface-700 size-md mr-2 animate-pulse rounded"></div>
					<div className="bg-surface-700 h-lg w-24 animate-pulse rounded"></div>
				</div>
				<div className="space-y-lg flex grow flex-col">
					{[...Array(2)].map((_, i) => (
						<div key={i} className="flex justify-between">
							<div className="gap-xs flex flex-col">
								<div className="bg-surface-700 h-md w-24 animate-pulse rounded"></div>
								<div className="bg-surface-700 h-sm w-20 animate-pulse rounded"></div>
							</div>
							<div className="space-y-xs text-right">
								<div className="bg-surface-700 h-md w-20 animate-pulse rounded"></div>
								<div className="bg-surface-700 h-sm w-16 animate-pulse rounded"></div>
							</div>
						</div>
					))}
					<div className="flex grow items-end justify-between">
						<div className="bg-surface-700 h-sm w-20 animate-pulse rounded"></div>
						<div className="bg-surface-700 h-sm w-28 animate-pulse rounded"></div>
					</div>
				</div>
			</div>
		</div>
	</motion.div>
);
