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
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="grid md:grid-cols-4 gap-4 items-center">
        {/* Status Section */}
        <div className="md:col-span-1">
          <h3 className="text-sm font-medium text-gray-700">
            PLC Connection Status
          </h3>
          <p className="text-lg font-bold mt-1">
            {connectionStatus?.status || "Unknown"}
          </p>
          <p className="text-xs text-gray-500">
            Master ID: {connectionStatus?.masterId || "N/A"}
          </p>
        </div>

        {/* Master Selection */}
        <div className="md:col-span-2">
          <Select value={selectedMasterId} onValueChange={onMasterSelect}>
            <SelectTrigger>
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
        </div>

        {/* Connect/Disconnect Button */}
        <div className="md:col-span-1">
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
              ? "Disconnect"
              : "Connect"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
