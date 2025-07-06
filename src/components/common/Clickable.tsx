import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@utils/cn";

interface ClickableProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {
  children: ReactNode;
  disabled?: boolean;
}

const Clickable = ({ children, className = "", disabled = false, onClick, ...props }: ClickableProps) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(event);
  };

  return (
    <motion.div
      className={cn("cursor-pointer transition-colors duration-100", disabled && "opacity-50 cursor-not-allowed", className)}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Clickable;
