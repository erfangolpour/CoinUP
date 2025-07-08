import { cn } from "@utils/cn";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface ClickableProps
	extends React.ComponentPropsWithoutRef<typeof motion.div> {
	children: ReactNode;
	disabled?: boolean;
}

const Clickable = ({
	children,
	className = "",
	disabled = false,
	onClick,
	...props
}: ClickableProps) => {
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (disabled) return;
		onClick?.(event);
	};

	return (
		<motion.div
			className={cn(
				"cursor-pointer",
				disabled && "cursor-not-allowed opacity-50",
				className,
			)}
			whileHover={disabled ? {} : { scale: 1.05 }}
			whileTap={disabled ? {} : { scale: 0.95 }}
			transition={{
				duration: 0.1,
				ease: "easeOut",
				type: "tween",
			}}
			onClick={handleClick}
			{...props}
		>
			{children}
		</motion.div>
	);
};

export default Clickable;
