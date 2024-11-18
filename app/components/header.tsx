// components/HeaderCard.tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { WifiIcon } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
}

const HeaderCard = ({ isConnected }: HeaderProps) => {
  return (
    <div className="bg-white border-2 border-[#91a6be] rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#003448]">
            Industrial IoT Dashboard
          </h1>
        </div>
        <Alert 
          className={`w-full md:w-fit ${
            isConnected ? "bg-[#dee2ef]" : "bg-[#dee2ef]"
          } border-[#91a6be]`}
        >
          <WifiIcon className={`h-4 w-4 ${
            isConnected ? "text-[#003448]" : "text-red-600"
          }`} />
          <AlertDescription className={`flex items-center gap-2 ${
            isConnected ? "text-[#003448]" : "text-red-600"
          }`}>
            <span>WebSocket:</span>
            <span className="font-semibold">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </AlertDescription>
        </Alert>
      </div>
      <Separator className="mt-4 bg-[#91a6be]" />
    </div>
  );
};

export default HeaderCard;