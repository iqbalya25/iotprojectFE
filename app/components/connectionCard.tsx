import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
    <div className="bg-white rounded-lg shadow-lg border-2 border-[#91a6be] p-4">
      <div className="grid md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-1">
          <h3 className="text-sm font-medium text-[#003448]">
            PLC Connection Status
          </h3>
          <p
            className={`text-lg font-bold mt-1 ${
              connectionStatus?.status === "Connected"
                ? "text-[#003448]"
                : "text-red-600"
            }`}
          >
            {connectionStatus?.status || "Unknown"}
          </p>
          <p className="text-xs text-[#91a6be]">
            Master ID: {connectionStatus?.masterId || "N/A"}
          </p>
        </div>

        <div className="md:col-span-2">
          <Select value={selectedMasterId} onValueChange={onMasterSelect}>
            <SelectTrigger className="border-2 border-[#91a6be] bg-[#dee2ef]">
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

        <div className="md:col-span-1">
          <Button
            onClick={onConnect}
            className={`w-full ${
              connectionStatus?.status === "Connected"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#003448] hover:bg-[#003448]/90"
            } text-white border-none`}
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
