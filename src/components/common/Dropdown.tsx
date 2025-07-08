import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Clickable from "./Clickable";

interface DropdownItem {
	label: string;
	icon?: React.ReactNode;
	onClick: () => void;
}

interface DropdownProps {
	trigger: React.ReactNode;
	items: DropdownItem[];
	className?: string;
	dropdownClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
	trigger,
	items,
	className = "",
	dropdownClassName = "",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className={cn("relative", className)} ref={dropdownRef}>
			<div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						className={cn(
							"glass-effect absolute top-full right-0 z-50 mt-2 w-40 rounded-lg py-2 webkit-backdrop-filter",
							dropdownClassName
						)}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
					>
						{items.map((item, index) => (
							<Clickable
								key={index}
								onClick={() => {
									item.onClick();
									setIsOpen(false);
								}}
								className="hover:bg-surface-200 dark:hover:bg-surface-700 flex w-full items-center space-x-2 px-4 py-2 text-left text-sm"
							>
								{item.icon && (
									<span className="size-4">{item.icon}</span>
								)}
								<span>{item.label}</span>
							</Clickable>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
