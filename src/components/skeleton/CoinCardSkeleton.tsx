import { motion } from "motion/react";

export const CoinCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative p-6 lg:p-8 rounded-xl border glass-effect border-slate-700/50 animate-pulse"
  >
    {/* Favorite Button Skeleton */}
    <div className="absolute top-4 right-4 w-8 h-8 bg-slate-700 rounded-full"></div>

    {/* Header */}
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-700 rounded-full"></div>
      <div className="flex-1">
        <div className="h-5 lg:h-6 bg-slate-700 rounded mb-2 w-3/4"></div>
        <div className="h-3 lg:h-4 bg-slate-700 rounded w-16"></div>
      </div>
    </div>

    {/* Price */}
    <div className="mb-6">
      <div className="h-8 lg:h-10 bg-slate-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-1/3"></div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
      </div>
      <div>
        <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
      </div>
    </div>

    {/* Volume and Market Cap */}
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3"></div>
      </div>
      <div>
        <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3"></div>
      </div>
    </div>
  </motion.div>
);
