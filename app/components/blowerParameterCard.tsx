import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlowerParameters } from "../types/types";
import { Activity } from "lucide-react";

interface BlowerParametersCardProps {
  parameters: BlowerParameters | null;
}

const BlowerParametersCard = ({ parameters }: BlowerParametersCardProps) => {
  const formatFrequency = (value: number) => (value / 100).toFixed(2);
  const formatAmpere = (value: number) => (value / 100).toFixed(2);
  const formatVoltage = (value: number) => (value / 10).toFixed(1);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Blower Parameters</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">
              Frequency
            </p>
            <p className="text-2xl font-bold">
              {parameters
                ? `${formatFrequency(parameters.frequency)} Hz`
                : "N/A"}
            </p>
          </div>
          <div className="space-y-1 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">Current</p>
            <p className="text-2xl font-bold">
              {parameters ? `${formatAmpere(parameters.ampere)} A` : "N/A"}
            </p>
          </div>
          <div className="space-y-1 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">Voltage</p>
            <p className="text-2xl font-bold">
              {parameters ? `${formatVoltage(parameters.voltage)} V` : "N/A"}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Last Updated:{" "}
          {parameters?.timestamp
            ? new Date(parameters.timestamp).toLocaleString()
            : "Never"}
        </p>
      </CardContent>
    </Card>
  );
};

export default BlowerParametersCard;
