import { motion } from "motion/react";

export const CoinDetailSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-6"
  >
    {/* Header Skeleton */}
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse"></div>
      <div className="h-8 bg-slate-700 rounded w-32 animate-pulse"></div>
    </div>

    {/* Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
        <div className="h-64 bg-slate-700 rounded"></div>
      </div>
    </div>
  </motion.div>
);
