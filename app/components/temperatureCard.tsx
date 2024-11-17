import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThermometerIcon } from "lucide-react";
import { Temperature } from "../types/types";

interface TemperatureCardProps {
  temperature: Temperature | null;
}

const TemperatureCard = ({ temperature }: TemperatureCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Temperature Sensor
        </CardTitle>
        <ThermometerIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-3xl font-bold">
            {temperature?.value ? `${temperature.value}°C` : "N/A"}
          </p>
          <p className="text-xs text-muted-foreground">
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
