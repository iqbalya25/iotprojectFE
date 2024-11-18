// components/TemperatureLogs.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TemperatureLog {
  timestamp: string;
  value: number;
  deviceId: string;
  masterId: number;
}

interface TemperatureLogsProps {
  data: TemperatureLog[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDateChange: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

const TemperatureLogs = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onDateChange,
  selectedDate,
}: TemperatureLogsProps) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onDateChange(selectedDate);
  };

  return (
    <Card className="border-2 border-[#91a6be] bg-white">
      <CardHeader className="border-b border-[#91a6be]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-[#003448]">
            Temperature Logs
          </CardTitle>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal border-[#91a6be] hover:bg-[#dee2ef]",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-[#91a6be]" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-[#91a6be]">
          <Table>
            <TableHeader className="bg-[#dee2ef]">
              <TableRow>
                <TableHead className="text-[#003448] w-[200px]">Timestamp</TableHead>
                <TableHead className="text-[#003448] text-right">Temperature (°C)</TableHead>
                <TableHead className="text-[#003448]">Device ID</TableHead>
                <TableHead className="text-[#003448]">Master ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-[#003448]">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-[#003448]">
                    {log.value}
                  </TableCell>
                  <TableCell className="text-[#003448]">{log.deviceId}</TableCell>
                  <TableCell className="text-[#003448]">{log.masterId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#91a6be]">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-[#91a6be] hover:bg-[#dee2ef]"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-[#91a6be] hover:bg-[#dee2ef]"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureLogs;