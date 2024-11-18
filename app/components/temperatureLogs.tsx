// components/TemperatureLogs.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TemperatureLog } from "../types/types";

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
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="border-2 border-[#91a6be] bg-white">
      <CardHeader className="border-b border-[#91a6be]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-sm font-medium text-[#003448]">
            Temperature Logs
          </CardTitle>
          <div className="w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto border-[#91a6be] hover:bg-[#dee2ef]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-[#91a6be]" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={onDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-[#91a6be] overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#dee2ef]">
              <TableRow>
                <TableHead className="text-[#003448] w-[200px]">
                  Timestamp
                </TableHead>
                <TableHead className="text-[#003448] text-center w-[150px]">
                  Temperature (°C)
                </TableHead>
                <TableHead className="text-[#003448] w-[150px]">
                  Device
                </TableHead>
                <TableHead className="text-[#003448] w-[200px]">
                  Master Name
                </TableHead>
                <TableHead className="text-[#003448] w-[200px]">
                  Location
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium text-[#003448]">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell className="text-center text-[#003448]">
                    {log.value1}
                  </TableCell>
                  <TableCell className="text-[#003448]">
                    {log.deviceName}
                  </TableCell>
                  <TableCell className="text-[#003448]">
                    {log.masterName}
                  </TableCell>
                  <TableCell className="text-[#003448]">
                    {log.masterLocation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#91a6be]">
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="border-[#91a6be] hover:bg-[#dee2ef]"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
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
