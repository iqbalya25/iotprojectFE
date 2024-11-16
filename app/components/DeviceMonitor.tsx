// components/DeviceMonitor.tsx
"use client";
import { useWebSocket } from "../hooks/useWebSocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ThermometerIcon, FanIcon, PowerIcon, WifiIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Master {
  id: number;
  masterName: string;
  masterIpAddress: string;
  masterPort: number;
  plcId: number;
  masterLocation: string;
}

const DeviceMonitor = () => {
  const {
    deviceStatus,
    connectionStatus,
    temperature,
    isConnected,
    sendCommand,
  } = useWebSocket();

  const [masters, setMasters] = useState<Master[]>([]);
  const [selectedMasterId, setSelectedMasterId] = useState<string>("");

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        
        const response = await fetch(`${apiUrl}/api/masters`);
        if (response.ok) {
          const data = await response.json();
          setMasters(data);
        } else {
          const text = await response.text();
        }
      } catch (error) {
        console.error('Error fetching masters:', error);
      }
    };

    fetchMasters();
  }, []);

  const handleConnect = () => {
    if (connectionStatus?.status === "Connected") {
      // If already connected, send disconnect command
      sendCommand({
        action: "DISCONNECT_MASTER",
      });
    } else {
      // If disconnected, send connect command with selected PLC
      const selectedMaster = masters.find(
        (m) => m.id.toString() === selectedMasterId
      );
      if (selectedMaster) {
        sendCommand({
          action: "CONNECT_MASTER",
          ipAddress: selectedMaster.masterIpAddress,
        });
      }
    }
  };

  const handleBlowerControl = (action: "ON" | "OFF") => {
    sendCommand({
      action: action === "ON" ? "TURN_ON_BLOWER" : "TURN_OFF_BLOWER",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Connection Status Card */}
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
              <Select
                value={selectedMasterId}
                onValueChange={setSelectedMasterId}
              >
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
                onClick={handleConnect}
                className="w-full"
                variant={
                  connectionStatus?.status === "Connected"
                    ? "outline"
                    : "default"
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

        {/* Temperature Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Temperature Sensor
            </CardTitle>
            <ThermometerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold">
                {temperature?.value ? `${temperature.value}°C` : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                Last Updated:{" "}
                {temperature?.timestamp
                  ? new Date(temperature.timestamp).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Blower Control Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Blower Control
            </CardTitle>
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
                  onClick={() => handleBlowerControl("ON")}
                  variant="default"
                  className="w-full"
                  disabled={deviceStatus?.status === "ON"}
                >
                  Turn On
                </Button>
                <Button
                  onClick={() => handleBlowerControl("OFF")}
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
      </div>
    </div>
  );
};

export default DeviceMonitor;
