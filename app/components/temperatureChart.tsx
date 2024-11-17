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
import { TemperatureData } from "../types/types";

interface TemperatureChartProps {
  data: TemperatureData[];
  title: string;
  type: "realtime" | "historical";
}

const TemperatureChart = ({ data, title, type }: TemperatureChartProps) => {
  const [animatedData, setAnimatedData] = useState<TemperatureData[]>([]);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // Progressive data loading for animation
  useEffect(() => {
    if (data.length > 0) {
      const timeout = setTimeout(() => {
        setAnimatedData(data);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [data]);

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    return isMobile
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleTimeString();
  };

  // Calculate display settings based on viewport and data
  const calculateSettings = () => {
    let visiblePoints = data.length;
    if (isMobile) {
      visiblePoints = 5; // Show only 5 points on mobile
    }
    return {
      visiblePoints,
      scrollable: isMobile && data.length > 5,
    };
  };

  const { visiblePoints, scrollable } = calculateSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`h-[300px] ${scrollable ? "overflow-x-auto" : ""}`}>
          <div
            style={{
              width: scrollable
                ? `${Math.max(100, data.length * 80)}px`
                : "100%",
              height: "100%",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={animatedData}
                margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  fontSize={12}
                  interval={isMobile ? 0 : "preserveStart"}
                  minTickGap={20}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  label={{
                    value: "Temperature (°C)",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 12,
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
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureChart;
