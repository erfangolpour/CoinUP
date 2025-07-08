import { memo, useEffect, useState } from "react";

interface TimerProps {
	lastUpdated: number;
	refreshInterval: number;
	className?: string;
}

const Timer = memo(
	({ lastUpdated, refreshInterval, className = "" }: TimerProps) => {
		const [currentTime, setCurrentTime] = useState(Date.now());

		useEffect(() => {
			const interval = setInterval(() => {
				setCurrentTime(Date.now());
			}, 1000);

			return () => clearInterval(interval);
		}, []);

		const formatLastUpdated = (timestamp: number) => {
			if (!timestamp) return "Never";
			const now = currentTime;
			const diff = now - timestamp;
			const seconds = Math.floor(diff / 1000);
			const minutes = Math.floor(seconds / 60);

			if (minutes === 0) return "Just now";
			if (minutes === 1) return "1 minute ago";
			if (minutes < 60) return `${minutes} minutes ago`;

			const hours = Math.floor(minutes / 60);
			if (hours === 1) return "1 hour ago";
			return `${hours} hours ago`;
		};

		const formatNextUpdate = (timestamp: number) => {
			if (!timestamp) return "Soon";
			const nextUpdate = timestamp + refreshInterval;
			const diff = nextUpdate - currentTime;
			const seconds = Math.floor(diff / 1000);

			if (seconds <= 0) return "Updating...";
			if (seconds < 60) return `in ${seconds}s`;
			const minutes = Math.floor(seconds / 60);
			return `in ${minutes}m ${seconds % 60}s`;
		};

		return (
			<div className={`text-content-secondary text-sm-responsive ${className}`}>
				<div>Updated {formatLastUpdated(lastUpdated)}</div>
				<div className="text-content-tertiary text-xs-responsive">
					Next update {formatNextUpdate(lastUpdated)}
				</div>
			</div>
		);
	},
);

export default Timer;
