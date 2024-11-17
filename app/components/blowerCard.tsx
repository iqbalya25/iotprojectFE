import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FanIcon } from "lucide-react";
import { DeviceStatus } from "../types/types";
import { useState } from "react";

interface BlowerCardProps {
  deviceStatus: DeviceStatus | null;
  onBlowerControl: (action: "ON" | "OFF") => void;
  onFrequencySet: (frequency: number) => void;
}

const BlowerCard = ({
  deviceStatus,
  onBlowerControl,
  onFrequencySet,
}: BlowerCardProps) => {
  const [frequency, setFrequency] = useState("");

  const handleFrequencySubmit = () => {
    const freqValue = parseFloat(frequency);
    if (!isNaN(freqValue) && freqValue >= 0) {
      onFrequencySet(Math.round(freqValue * 100));
    }
  };

  return (
    <Card className="border-2 border-[#91a6be] bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[#003448]">
          Blower Control
        </CardTitle>
        <FanIcon className="h-4 w-4 text-[#91a6be]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-[#003448]">
              {deviceStatus?.status || "Unknown"}
            </p>
            <p className="text-xs text-[#91a6be]">
              Device ID: {deviceStatus?.deviceId || "N/A"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onBlowerControl("ON")}
              className="w-full bg-[#003448] hover:bg-[#003448]/90 text-white"
              disabled={deviceStatus?.status === "ON"}
            >
              Turn On
            </Button>
            <Button
              onClick={() => onBlowerControl("OFF")}
              variant="outline"
              className="w-full border-[#91a6be] text-[#003448] hover:bg-[#dee2ef]"
              disabled={deviceStatus?.status === "OFF"}
            >
              Turn Off
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003448]">
              Set Frequency (Hz)
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Enter frequency"
                className="border-[#91a6be] bg-[#dee2ef]"
              />
              <Button
                onClick={handleFrequencySubmit}
                className="bg-[#003448] hover:bg-[#003448]/90 text-white"
              >
                Set
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlowerCard;
