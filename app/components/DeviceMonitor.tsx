import { useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Master } from "../types/types";
import HeaderCard from "./header";
import ConnectionCard from "./connectionCard";
import TemperatureCard from "./temperatureCard";
import BlowerCard from "./blowerCard";
import TemperatureGraphs from "./temperatureGraph";

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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <HeaderCard isConnected={isConnected} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ConnectionCard
          connectionStatus={connectionStatus}
          masters={masters}
          selectedMasterId={selectedMasterId}
          onMasterSelect={setSelectedMasterId}
          onConnect={handleConnect}
        />
        <TemperatureCard temperature={temperature} />
        <BlowerCard
          deviceStatus={deviceStatus}
          onBlowerControl={handleBlowerControl}
        />
        <TemperatureGraphs realtimeData={temperature} />
      </div>
    </div>
  );
};

export default DeviceMonitor;
