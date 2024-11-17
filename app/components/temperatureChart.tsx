import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TemperatureChartProps, TemperatureData } from "../types/types";

const TemperatureChart = ({ data, title, type }: TemperatureChartProps) => {
  // For real-time chart, we'll keep last N points
  const MAX_POINTS = 20;
  const [chartData, setChartData] = useState<TemperatureData[]>([]);

  useEffect(() => {
    if (type === "realtime") {
      setChartData((prev) => {
        const newData = [...prev, ...data];
        return newData.slice(-MAX_POINTS);
      });
    } else {
      setChartData(data);
    }
  }, [data, type]);

  const formatXAxis = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              domain={["auto", "auto"]}
              label={{
                value: "Temperature (°C)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleString()}
              formatter={(value: number) => [`${value}°C`, "Temperature"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={type === "historical"}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TemperatureChart;
