import AuthModal from "@components/AuthModal";
import { Header } from "@components/Header";
import { AnimatePresence } from "motion/react";
import { useState } from "react";

interface LayoutProps {
	children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

	return (
		<div className="from-surface-900 via-surface-800 to-surface-900 min-h-screen bg-gradient-to-br">
			<Header setIsAuthModalOpen={setIsAuthModalOpen} />
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
