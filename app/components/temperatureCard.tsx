import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThermometerIcon } from "lucide-react";
import { Temperature } from "../types/types";

interface TemperatureCardProps {
  temperature: Temperature | null;
}

const TemperatureCard = ({ temperature }: TemperatureCardProps) => {
  return (
    <Card className="border-2 border-[#91a6be] bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-[#003448]">
            Temperature Sensor
          </CardTitle>
          <ThermometerIcon className="h-4 w-4 text-[#91a6be]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-[#003448]">
            {temperature?.value ? `${temperature.value}°C` : "N/A"}
          </p>
          <p className="text-xs text-[#91a6be]">
            Last Updated:{" "}
            {temperature?.timestamp
              ? new Date(temperature.timestamp).toLocaleString()
              : "Never"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureCard;
