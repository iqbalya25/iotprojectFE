import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { BlowerParameters } from "../types/types";

interface BlowerParametersCardProps {
  parameters: BlowerParameters | null;
}

const BlowerParametersCard = ({ parameters }: BlowerParametersCardProps) => {
  const formatFrequency = (value: number) => (value / 100).toFixed(2);
  const formatAmpere = (value: number) => (value / 100).toFixed(2);
  const formatVoltage = (value: number) => (value / 10).toFixed(1);

  return (
    <Card className="col-span-2 border-2 border-[#91a6be] bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#91a6be]">
        <CardTitle className="text-sm font-medium text-[#003448]">
          Blower Parameters
        </CardTitle>
        <Activity className="h-4 w-4 text-[#91a6be]" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1 p-4 bg-[#dee2ef] rounded-lg border border-[#91a6be]">
            <p className="text-sm font-medium text-[#003448]">Frequency</p>
            <p className="text-2xl font-bold text-[#003448]">
              {parameters
                ? `${formatFrequency(parameters.frequency)} Hz`
                : "N/A"}
            </p>
          </div>
          <div className="space-y-1 p-4 bg-[#dee2ef] rounded-lg border border-[#91a6be]">
            <p className="text-sm font-medium text-[#003448]">Current</p>
            <p className="text-2xl font-bold text-[#003448]">
              {parameters ? `${formatAmpere(parameters.ampere)} A` : "N/A"}
            </p>
          </div>
          <div className="space-y-1 p-4 bg-[#dee2ef] rounded-lg border border-[#91a6be]">
            <p className="text-sm font-medium text-[#003448]">Voltage</p>
            <p className="text-2xl font-bold text-[#003448]">
              {parameters ? `${formatVoltage(parameters.voltage)} V` : "N/A"}
            </p>
          </div>
        </div>
        <p className="text-xs text-[#91a6be] mt-4">
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
