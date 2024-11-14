// components/DeviceMonitor.tsx
'use client'
import { useWebSocket } from '../hooks/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ThermometerIcon, FanIcon, PowerIcon, WifiIcon } from "lucide-react";

const DeviceMonitor = () => {
  const { 
    deviceStatus, 
    connectionStatus, 
    temperature, 
    isConnected,
    sendCommand 
  } = useWebSocket();

  const handleConnect = () => {
    sendCommand({
      action: 'CONNECT_MASTER',
      ipAddress: '192.168.1.100' // Replace with your PLC IP
    });
  };

  const handleBlowerControl = (action: 'ON' | 'OFF') => {
    sendCommand({
      action: action === 'ON' ? 'TURN_ON_BLOWER' : 'TURN_OFF_BLOWER'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Industrial IoT Dashboard</h1>
        <Alert 
          className={`w-fit ${isConnected ? 'bg-green-50' : 'bg-red-50'}`}
        >
          <WifiIcon className={`h-4 w-4 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
          <AlertDescription>
            {isConnected ? 'Connected' : 'Disconnected'}
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
                  {connectionStatus?.status || 'Unknown'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Master ID: {connectionStatus?.masterId || 'N/A'}
                </p>
              </div>
              <Button 
                onClick={handleConnect}
                className="w-full"
                variant={connectionStatus?.status === 'Connected' ? 'outline' : 'default'}
              >
                {connectionStatus?.status === 'Connected' ? 'Disconnect' : 'Connect to PLC'}
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
                {temperature?.value ? `${temperature.value}°C` : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                Last Updated: {temperature?.timestamp ? 
                  new Date(temperature.timestamp).toLocaleString() : 'Never'}
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
                  {deviceStatus?.status || 'Unknown'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Device ID: {deviceStatus?.deviceId || 'N/A'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => handleBlowerControl('ON')}
                  variant="default"
                  className="w-full"
                  disabled={deviceStatus?.status === 'ON'}
                >
                  Turn On
                </Button>
                <Button 
                  onClick={() => handleBlowerControl('OFF')}
                  variant="outline"
                  className="w-full"
                  disabled={deviceStatus?.status === 'OFF'}
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