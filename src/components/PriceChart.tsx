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
import colors from "tailwindcss/colors";

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
			if (chartData.length < 2) return colors.green[500];

			const firstPrice = chartData[0]?.price || 0;
			const lastPrice = chartData[chartData.length - 1]?.price || 0;
			const positive = lastPrice > firstPrice;

			return positive ? colors.green[500] : colors.red[500]; // success-500 : danger-500
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
					<div className="glass-effect border-surface-600 rounded-lg border p-3">
						<p className="text-content-secondary text-sm">
							{data.date}
						</p>
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
						<CartesianGrid strokeDasharray="3 3" stroke="#475569" />
						<XAxis
							dataKey="timestamp"
							tick={{ fill: "#94a3b8", fontSize: 12 }}
							tickFormatter={formatDate}
							axisLine={{ stroke: "#64748b" }}
						/>
						<YAxis
							tick={{ fill: "#94a3b8", fontSize: 12 }}
							tickFormatter={formatPrice}
							axisLine={{ stroke: "#64748b" }}
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
								stroke: "#1e293b",
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
