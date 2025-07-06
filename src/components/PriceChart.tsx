import type { ChartData } from "@/types/crypto";
import { formatNumber } from "@utils/formatters";
import { memo, useMemo } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface PriceChartProps {
	data: ChartData | null;
	period: number;
}

export const PriceChart: React.FC<PriceChartProps> = memo(
	({ data, period }) => {
		// Memoize chart data transformation
		const chartData = useMemo(() => {
			if (!data || !data.prices) return [];

			return data.prices.map(([timestamp, price]) => ({
				timestamp,
				price,
				date: new Date(timestamp).toLocaleDateString(),
				time: new Date(timestamp).toLocaleTimeString(),
			}));
		}, [data]);

		// Memoize trend calculation
		const strokeColor = useMemo(() => {
			if (chartData.length < 2) return "#10B981";

			const firstPrice = chartData[0]?.price || 0;
			const lastPrice = chartData[chartData.length - 1]?.price || 0;
			const positive = lastPrice > firstPrice;

			return positive ? "#10B981" : "#EF4444";
		}, [chartData]);

		const formatPrice = (value: number) => {
			return formatNumber(value, "$", "");
		};

		const formatDate = (timestamp: number) => {
			const date = new Date(timestamp);
			if (period <= 7) {
				return date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});
			} else if (period <= 30) {
				return date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});
			} else {
				return date.toLocaleDateString("en-US", {
					month: "short",
					year: "2-digit",
				});
			}
		};

		const CustomTooltip = ({ active, payload }: any) => {
			if (active && payload && payload.length) {
				const data = payload[0].payload;
				return (
					<div className="glass-effect rounded-lg border border-slate-600 p-3 backdrop-blur-sm">
						<p className="text-sm text-slate-300">{data.date}</p>
						<p className="font-semibold">
							Price: {formatPrice(data.price)}
						</p>
					</div>
				);
			}
			return null;
		};

		return (
			<div className="h-64 w-full lg:h-80">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
						<XAxis
							dataKey="timestamp"
							tick={{ fill: "#9CA3AF", fontSize: 12 }}
							tickFormatter={formatDate}
							axisLine={{ stroke: "#4B5563" }}
						/>
						<YAxis
							tick={{ fill: "#9CA3AF", fontSize: 12 }}
							tickFormatter={formatPrice}
							axisLine={{ stroke: "#4B5563" }}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Line
							type="monotone"
							dataKey="price"
							stroke={strokeColor}
							strokeWidth={2}
							dot={false}
							activeDot={{
								r: 4,
								fill: strokeColor,
								stroke: "#1F2937",
								strokeWidth: 2,
							}}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		);
	},
	// Optimize re-renders for PriceChart
	(prevProps, nextProps) =>
		prevProps.data === nextProps.data &&
		prevProps.period === nextProps.period,
);
