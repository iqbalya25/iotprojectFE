import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PowerIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConnectionStatus, Master } from "../types/types";

interface ConnectionCardProps {
  connectionStatus: ConnectionStatus | null;
  masters: Master[];
  selectedMasterId: string;
  onMasterSelect: (id: string) => void;
  onConnect: () => void;
}

const ConnectionCard = ({
  connectionStatus,
  masters,
  selectedMasterId,
  onMasterSelect,
  onConnect,
}: ConnectionCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          PLC Connection Status
        </CardTitle>
        <PowerIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold">
              {connectionStatus?.status || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              Master ID: {connectionStatus?.masterId || "N/A"}
            </p>
          </div>
          <Select value={selectedMasterId} onValueChange={onMasterSelect}>
            <SelectTrigger className="w-full mb-3">
              <SelectValue placeholder="Select PLC Master" />
            </SelectTrigger>
            <SelectContent>
              {masters.map((master) => (
                <SelectItem key={master.id} value={master.id.toString()}>
                  {master.masterName} - {master.masterIpAddress}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={onConnect}
            className="w-full"
            variant={
              connectionStatus?.status === "Connected" ? "outline" : "default"
            }
            disabled={
              connectionStatus?.status === "Connected"
                ? false
                : !selectedMasterId
            }
          >
            {connectionStatus?.status === "Connected"
              ? "Disconnect from PLC"
              : "Connect to PLC"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionCard;
