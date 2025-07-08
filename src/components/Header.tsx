import { useStore } from "@/stores/useCoinStore";
import Clickable from "@components/common/Clickable";
import { Dropdown } from "@components/common/Dropdown";
import UserMenu from "@components/UserMenu";
import { useTheme } from "@hooks/useTheme";
import { useAuthStore } from "@stores/useAuthStore";
import {
	ChevronDown,
	LogIn,
	Moon,
	Sun,
	TrendingUp,
	User,
	UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type HeaderProps = {
	setIsAuthModalOpen: (open: boolean) => void;
};

export const Header: React.FC<HeaderProps> = ({ setIsAuthModalOpen }) => {
	const { setSelectedCoin } = useStore();
	const { isAuthenticated, setIsLogin } = useAuthStore();
	const { theme, toggleTheme } = useTheme();

	const authDropdownItems = [
		{
			label: "Login",
			icon: <LogIn className="size-4" />,
			onClick: () => {
				setIsLogin(true);
				setIsAuthModalOpen(true);
			},
		},
		{
			label: "Sign Up",
			icon: <UserPlus className="size-4" />,
			onClick: () => {
				setIsLogin(false);
				setIsAuthModalOpen(true);
			},
		},
	];

	return (
		<motion.header
			className="glass-effect sticky top-0 z-50 backdrop-blur-md"
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<div className="md:py-lg md:px-lg container mx-auto px-4 py-3">
				<div className="flex items-center justify-between gap-4 md:gap-10">
					{/* Logo */}
					<Clickable
						className="space-x-sm flex items-center"
						onClick={() => setSelectedCoin(null)}
					>
						<div className="from-primary-500 to-secondary-600 size-2xl flex items-center justify-center rounded-lg bg-gradient-to-br text-slate-50">
							<TrendingUp className="size-md" />
						</div>
						<span className="text-xl-responsive font-bold">
							CoinUP
						</span>
					</Clickable>

					{/* Theme Toggle and Auth Section */}
					<div className="md:space-x-sm flex items-center space-x-2">
						<Clickable
							onClick={toggleTheme}
							className="btn-ghost p-sm"
							aria-label={`Switch to ${theme == "dark" ? "light" : "dark"} theme`}
						>
							<AnimatePresence>
								{theme === "dark" ? (
									<motion.span
										className="size-sm"
										initial={{
											opacity: 0,
											scale: 1,
											rotate: -90,
										}}
										animate={{
											opacity: 1,
											scale: 1,
											rotate: 0,
										}}
										exit={{
											opacity: 0,
											scale: 1,
											rotate: -90,
										}}
										transition={{ duration: 0.5 }}
									>
										<Sun className="size-sm" />
									</motion.span>
								) : (
									<motion.span
										className="size-sm"
										initial={{
											opacity: 0,
											scale: 1,
											rotate: -90,
										}}
										animate={{
											opacity: 1,
											scale: 1,
											rotate: 0,
										}}
										exit={{
											opacity: 0,
											scale: 1,
											rotate: -90,
										}}
										transition={{ duration: 0.5 }}
									>
										<Moon className="size-sm" />
									</motion.span>
								)}
							</AnimatePresence>
						</Clickable>

						{/* Auth Selection */}
						{isAuthenticated ? (
							<UserMenu />
						) : (
							<>
								{/* Mobile Auth Dropdown */}
								<div className="md:hidden">
									<Dropdown
										trigger={
											<Clickable className="btn-primary space-x-xs px-sm py-sm">
												<User className="size-sm inline" />
												{/* <span className="text-xs">Account</span> */}
												<ChevronDown className="inline size-3 transition-transform" />
											</Clickable>
										}
										items={authDropdownItems}
									/>
								</div>

								{/* Desktop Auth Buttons */}
								<div className="hidden items-center space-x-3 text-sm md:flex">
									<Clickable
										onClick={() => {
											setIsLogin(true);
											setIsAuthModalOpen(true);
										}}
										className="btn-ghost space-x-xs px-md py-sm"
									>
										<LogIn className="inline size-4" />
										<span>Login</span>
									</Clickable>
									<Clickable
										onClick={() => {
											setIsLogin(false);
											setIsAuthModalOpen(true);
										}}
										className="btn-primary space-x-xs px-md py-sm"
									>
										<UserPlus className="inline size-4" />
										<span>Sign Up</span>
									</Clickable>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</motion.header>
	);
};
