// Update in components/DeviceMonitor.tsx

import { useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Master } from "../types/types";
import HeaderCard from "./header";
import ConnectionCard from "./connectionCard";
import TemperatureCard from "./temperatureCard";
import BlowerCard from "./blowerCard";

import TemperatureGraphs from "./temperatureGraph";
import BlowerParametersCard from "./blowerParameterCard";

const DeviceMonitor = () => {
  const {
    deviceStatus,
    connectionStatus,
    temperature,
    blowerParameters,
    isConnected,
    sendCommand,
    sendFrequencyCommand,
  } = useWebSocket();
  const [masters, setMasters] = useState<Master[]>([]);
  const [selectedMasterId, setSelectedMasterId] = useState<string>("");

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/masters`);
        if (response.ok) {
          const data = await response.json();
          setMasters(data);
        }
      } catch (error) {
        console.error("Error fetching masters:", error);
      }
    };

    fetchMasters();
  }, []);

  const handleConnect = () => {
    if (connectionStatus?.status === "Connected") {
      sendCommand({
        action: "DISCONNECT_MASTER",
      });
    } else {
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

  const handleFrequencySet = (frequency: number) => {
    sendFrequencyCommand(frequency);
  };

  return (
    <div className="min-h-screen">
      <HeaderCard isConnected={isConnected} />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Connection Status */}
        <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-4">
          <ConnectionCard
            connectionStatus={connectionStatus}
            masters={masters}
            selectedMasterId={selectedMasterId}
            onMasterSelect={setSelectedMasterId}
            onConnect={handleConnect}
          />
        </div>

        {/* Device Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TemperatureCard temperature={temperature} />
          <BlowerCard
            deviceStatus={deviceStatus}
            onBlowerControl={handleBlowerControl}
            onFrequencySet={handleFrequencySet}
          />
        </div>

        {/* Blower Parameters Card */}
        <BlowerParametersCard parameters={blowerParameters} />

        {/* Temperature Graphs */}
        <div className="w-full">
          <TemperatureGraphs realtimeData={temperature} />
        </div>
      </div>
    </div>
  );
};

export default DeviceMonitor;