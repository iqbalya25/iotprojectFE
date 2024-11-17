import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemperatureData } from "../types/types";
import TemperatureChart from "./temperatureChart";

interface TemperatureGraphsProps {
  realtimeData: TemperatureData | null;
}

const TemperatureGraphs = ({ realtimeData }: TemperatureGraphsProps) => {
  const [realtimeChartData, setRealtimeChartData] = useState<TemperatureData[]>(
    []
  );
  const [historicalData, setHistoricalData] = useState<TemperatureData[]>([]);
  const [timeRange, setTimeRange] = useState("1h");

  // Add new real-time data point when it arrives
  useEffect(() => {
    if (realtimeData) {
      setRealtimeChartData((prev) => [...prev, realtimeData]);
    }
  }, [realtimeData]);

  // Fetch historical data based on selected time range
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(
          `${apiUrl}/api/temperature/history?range=${timeRange}`
        );
        if (response.ok) {
          const data = await response.json();
          setHistoricalData(data);
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchHistoricalData();
  }, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Real-time Graph */}
      <TemperatureChart
        data={realtimeChartData}
        title="Real-time Temperature"
        type="realtime"
      />

      {/* Historical Graph */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Historical Data</h3>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TemperatureChart
          data={historicalData}
          title={`Temperature History (${timeRange})`}
          type="historical"
        />
      </div>
    </div>
  );
};

export default TemperatureGraphs;
