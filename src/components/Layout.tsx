import { useStore } from "@/stores/useCoinStore";
import AuthModal from "@components/AuthModal";
import Clickable from "@components/common/Clickable";
import UserMenu from "@components/UserMenu";
import { useAuthStore } from "@stores/useAuthStore";
import { LogIn, TrendingUp, UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface LayoutProps {
	children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { setSelectedCoin } = useStore();
	const { isAuthenticated, setIsLogin } = useAuthStore();
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

	return (
		<div className="from-surface-900 via-surface-800 to-surface-900 min-h-screen bg-gradient-to-br">
			{/* Header */}
			<motion.header
				className="glass-effect sticky top-0 z-50 backdrop-blur-md"
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className="py-lg px-lg container mx-auto">
					<div className="flex items-center justify-between gap-10">
						{/* Logo */}
						<Clickable
							className="space-x-sm flex items-center"
							onClick={() => setSelectedCoin(null)}
						>
							<div className="from-primary-500 to-secondary-600 size-2xl flex items-center justify-center rounded-lg bg-gradient-to-br">
								<TrendingUp className="size-md" />
							</div>
							<span className="text-xl-responsive font-bold">
								CoinUP
							</span>
						</Clickable>

						{/* Auth Section */}
						<div className="flex items-center space-x-4">
							{isAuthenticated ? (
								<UserMenu />
							) : (
								<div className="flex items-center space-x-3 text-sm">
									<Clickable
										onClick={() => {
											setIsLogin(true);
											setIsAuthModalOpen(true);
										}}
										className="btn-ghost space-x-xs px-4 py-2"
									>
										<LogIn className="inline size-4" />
										<span>Login</span>
									</Clickable>
									<Clickable
										onClick={() => {
											setIsLogin(false);
											setIsAuthModalOpen(true);
										}}
										className="btn-primary space-x-xs px-4 py-2"
									>
										<UserPlus className="inline size-4" />
										<span>Sign Up</span>
									</Clickable>
								</div>
							)}
						</div>
					</div>
				</div>
			</motion.header>

			{/* Main Content */}
			<main className="py-2xl px-lg container mx-auto">{children}</main>

			{/* Auth Modal */}
			<AnimatePresence>
				{isAuthModalOpen && (
					<AuthModal onClose={() => setIsAuthModalOpen(false)} />
				)}
			</AnimatePresence>
		</div>
	);
};
