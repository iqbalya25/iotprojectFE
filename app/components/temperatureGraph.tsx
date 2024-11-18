// components/TemperatureGraphs.tsx
import { useState, useEffect } from "react";
import { TemperatureData, TemperaturePaginatedResponse, TemperatureLog } from "../types/types";
import TemperatureChart from "./temperatureChart";
import TemperatureLogs from "./temperatureLogs";

interface TemperatureGraphsProps {
  realtimeData: TemperatureData | null;
}

const TemperatureGraphs = ({ realtimeData }: TemperatureGraphsProps) => {
  const [realtimeChartData, setRealtimeChartData] = useState<TemperatureData[]>([]);
  const [logsData, setLogsData] = useState<TemperatureLog[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Keep only last 20 points for real-time data
  useEffect(() => {
    if (realtimeData) {
      setRealtimeChartData((prev) => {
        const newData = [...prev, realtimeData];
        return newData.slice(-20);
      });
    }
  }, [realtimeData]);

  // Fetch logs data
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const dateParam = selectedDate 
          ? `&date=${selectedDate.toISOString().split('T')[0]}` 
          : '';
        const response = await fetch(
          `${apiUrl}/api/temperature/logs?page=${currentPage}${dateParam}&size=10`
        );
        
        if (response.ok) {
          const data: TemperaturePaginatedResponse = await response.json();
          setLogsData(data.content);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching temperature logs:", error);
      }
    };

    fetchLogs();
  }, [currentPage, selectedDate]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setCurrentPage(0); // Reset to first page when date changes
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Real-time Graph */}
      <div className="w-full">
        <TemperatureChart
          data={realtimeChartData}
          title="Real-time Temperature"
          type="realtime"
        />
      </div>

      {/* Temperature Logs Table */}
      <div className="w-full">
        <TemperatureLogs
          data={logsData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onDateChange={handleDateChange}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};

export default TemperatureGraphs;