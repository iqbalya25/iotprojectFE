import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { WifiIcon } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
}

const HeaderCard = ({ isConnected }: HeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold">Industrial IoT Dashboard</h1>
        <Alert className={`w-fit ${isConnected ? "bg-green-50" : "bg-red-50"}`}>
          <WifiIcon
            className={`h-4 w-4 ${
              isConnected ? "text-green-600" : "text-red-600"
            }`}
          />
          <AlertDescription>
            {isConnected ? "Connected" : "Disconnected"}
          </AlertDescription>
        </Alert>
      </div>
      <Separator />
    </>
  );
};

export default HeaderCard;
