import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { WifiIcon } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
}

const HeaderCard = ({ isConnected }: HeaderProps) => {
  return (
    <div className="bg-white border-2 border-[#91a6be] rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#003448]">
          Industrial IoT Dashboard
        </h1>
        <Alert
          className={`w-fit ${
            isConnected ? "bg-[#dee2ef]" : "bg-[#dee2ef]"
          } border-[#91a6be]`}
        >
          <WifiIcon
            className={`h-4 w-4 ${
              isConnected ? "text-[#003448]" : "text-red-600"
            }`}
          />
          <AlertDescription
            className={isConnected ? "text-[#003448]" : "text-red-600"}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </AlertDescription>
        </Alert>
      </div>
      <Separator className="mt-4 bg-[#91a6be]" />
    </div>
  );
};

export default HeaderCard;
