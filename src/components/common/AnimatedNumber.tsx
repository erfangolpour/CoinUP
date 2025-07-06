import { formatNumber } from "@utils/formatters";
import { useCallback, useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
	value: number | undefined | null;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	className?: string;
	simplified?: boolean;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
	value,
	prefix = "",
	suffix = "",
	decimals = 2,
	className = "",
	simplified = true,
}) => {
	if (value === undefined || value === null || isNaN(value)) {
		return <span className={className}>N/A</span>;
	}

	const [displayValue, setDisplayValue] = useState(value);
	const prevValueRef = useRef(value);
	const animationRef = useRef<number | null>(null);

	const cancelAnimation = useCallback(() => {
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = null;
		}
	}, []);

	useEffect(() => {
		const startValue = prevValueRef.current;
		const endValue = value;

		// Only animate if the change is significant (more than 0.1% change)
		const percentageChange = Math.abs((endValue - startValue) / startValue);

		if (percentageChange < 0.001) {
			setDisplayValue(endValue);
			prevValueRef.current = endValue;
			return;
		}

		// Cancel any existing animation
		cancelAnimation();

		const duration = 600; // Reduced duration for better performance
		const startTime = performance.now();

		const updateValue = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Smoother easing function (ease-out-cubic)
			const easeOut = 1 - Math.pow(1 - progress, 3);
			const currentValue = startValue + (endValue - startValue) * easeOut;

			setDisplayValue(currentValue);

			if (progress < 1) {
				animationRef.current = requestAnimationFrame(updateValue);
			} else {
				animationRef.current = null;
				prevValueRef.current = endValue;
			}
		};

		animationRef.current = requestAnimationFrame(updateValue);

		// Cleanup function
		return cancelAnimation;
	}, [value, cancelAnimation]);

	const formattedValue = formatNumber(
		displayValue,
		prefix,
		suffix,
		decimals,
		simplified,
	);
	return <span className={className}>{formattedValue}</span>;
};

export default AnimatedNumber;
