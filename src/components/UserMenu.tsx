import Clickable from "@components/common/Clickable";
import { useAuthStore } from "@stores/useAuthStore";
import { LogOut, Trash2, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const UserMenu: React.FC = () => {
	const { user, logout, deleteAccount } = useAuthStore();
	const [isOpen, setIsOpen] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setShowDeleteConfirm(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Handle logout
	const handleLogout = () => {
		logout();
		setIsOpen(false);
		toast.success("Logged out successfully");
	};

	// Handle account deletion
	const handleDeleteAccount = () => {
		deleteAccount();
		setIsOpen(false);
		setShowDeleteConfirm(false);
		toast.success("Account deleted successfully");
	};

	if (!user) return null;

	return (
		<div className="relative" ref={menuRef}>
			{/* User Avatar Button */}
			<Clickable
				onClick={() => setIsOpen(!isOpen)}
				className="hover:bg-surface-700 p-xs flex items-center rounded-xl transition-colors"
			>
				<div className="from-primary-500 to-secondary-600 size-2xl flex items-center justify-center rounded-full bg-gradient-to-br">
					<User className="size-sm text-white" />
				</div>
				<div className="ml-3 hidden text-sm sm:block">
					<p className="text-content-primary font-medium">
						{user.name}
					</p>
					<p className="text-content-tertiary">{user.email}</p>
				</div>
			</Clickable>

			{/* Dropdown Menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -10 }}
						transition={{ duration: 0.2 }}
						className="glass-effect py-xs absolute right-0 z-50 mt-2 w-64 rounded-xl backdrop-blur-lg"
					>
						{/* User Info */}
						<div className="border-surface-600 border-b p-4">
							<div className="space-x-sm flex items-center">
								<div className="size-2xl from-primary-500 to-secondary-600 flex items-center justify-center rounded-full bg-gradient-to-br">
									<User className="size-sm" />
								</div>
								<div>
									<p className="text-content-primary font-medium">
										{user.name}
									</p>
									<p className="text-content-tertiary text-sm">
										{user.email}
									</p>
								</div>
							</div>
						</div>

						{/* Menu Items */}
						<div className="py-2">
							{/* Logout */}
							<Clickable
								onClick={handleLogout}
								className="hover:bg-surface-700 space-x-sm px-md py-xs flex w-full items-center transition-colors"
							>
								<LogOut className="text-content-secondary size-sm" />
								<span className="text-content-primary">
									Logout
								</span>
							</Clickable>

							{/* Delete Account */}
							{!showDeleteConfirm ? (
								<Clickable
									onClick={() => setShowDeleteConfirm(true)}
									className="px-md py-xs flex w-full items-center space-x-3 text-red-400 transition-colors hover:bg-[#3f3449]"
								>
									<Trash2 className="size-sm" />
									<span>Delete Account</span>
								</Clickable>
							) : (
								<div className="border-surface-600 space-y-sm border-t px-4 py-2 text-sm">
									<p className="text-content-secondary">
										Are you sure you want to delete your
										account? This action cannot be undone.
									</p>
									<div className="flex space-x-2 text-center font-medium transition-colors [&>*]:grow">
										<Clickable
											onClick={handleDeleteAccount}
											className="py-xs rounded-lg bg-red-500 hover:bg-red-600"
										>
											Delete
										</Clickable>
										<Clickable
											onClick={() =>
												setShowDeleteConfirm(false)
											}
											className="py-xs bg-surface-600 hover:bg-surface-500 rounded-lg"
										>
											Cancel
										</Clickable>
									</div>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default UserMenu;
