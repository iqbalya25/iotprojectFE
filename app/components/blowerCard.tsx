import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FanIcon } from "lucide-react";
import { DeviceStatus } from "../types/types";

interface BlowerCardProps {
  deviceStatus: DeviceStatus | null;
  onBlowerControl: (action: "ON" | "OFF") => void;
}

const BlowerCard = ({ deviceStatus, onBlowerControl }: BlowerCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Blower Control</CardTitle>
        <FanIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default BlowerCard;
