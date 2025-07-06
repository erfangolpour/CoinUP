import { motion } from "motion/react";
import { useStore } from "@stores/useStore";
import { TrendingUp, Search } from "lucide-react";
import Clickable from "./common/Clickable";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { searchQuery, setSearchQuery, setSelectedCoin } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 glass-effect backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 lg:px-0 py-4 lg:py-6">
          <div className="flex items-center justify-between gap-10">
            {/* Logo */}
            <Clickable
              className="flex items-center space-x-3"
              onClick={() => setSelectedCoin(null)}
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <span className="text-xl lg:text-2xl font-bold text-white">
                CoinUP
              </span>
            </Clickable>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSelectedCoin(null)}
                  className="w-full pl-12 pr-4 py-3 lg:py-4 bg-slate-800/50 border border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-0 py-8 lg:py-12">
        {children}
      </main>
    </div>
  );
};
