// components/blowerCard.tsx

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

const BlowerCard = ({ deviceStatus, onBlowerControl, onFrequencySet }: BlowerCardProps) => {
  const [frequency, setFrequency] = useState("");

  const handleFrequencySubmit = () => {
    const freqValue = parseFloat(frequency);
    if (!isNaN(freqValue) && freqValue >= 0) {
      // Multiply by 100 for PLC format
      onFrequencySet(Math.round(freqValue * 100));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Blower Control</CardTitle>
        <FanIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold">
              {deviceStatus?.status || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              Device ID: {deviceStatus?.deviceId || "N/A"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onBlowerControl("ON")}
              variant="default"
              className="w-full"
              disabled={deviceStatus?.status === "ON"}
            >
              Turn On
            </Button>
            <Button
              onClick={() => onBlowerControl("OFF")}
              variant="outline"
              className="w-full"
              disabled={deviceStatus?.status === "OFF"}
            >
              Turn Off
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Set Frequency (Hz)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Enter frequency"
              />
              <Button onClick={handleFrequencySubmit}>Set</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlowerCard;