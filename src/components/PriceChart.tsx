import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/utils/formatters";
import type { ChartData } from "@/types/crypto";

interface PriceChartProps {
  data: ChartData | null;
  period: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, period }) => {
  if (!data || !data.prices || data.prices.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 lg:h-80">
        <p className="text-slate-400">No price data available</p>
      </div>
    );
  }

  const chartData = data.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
    date: new Date(timestamp).toLocaleDateString(),
    time: new Date(timestamp).toLocaleTimeString(),
  }));

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
        <div className="glass-effect rounded-lg p-3 backdrop-blur-sm border border-slate-600">
          <p className="text-slate-300 text-sm">{data.date}</p>
          <p className="font-semibold">Price: {formatPrice(data.price)}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate if price is trending up or down
  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const isPositive = lastPrice > firstPrice;

  return (
    <div className="h-64 lg:h-80 w-full">
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
            stroke={isPositive ? "#10B981" : "#EF4444"}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: isPositive ? "#10B981" : "#EF4444",
              stroke: "#1F2937",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
