// hooks/useWebSocket.ts
"use client";
import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface DeviceStatus {
  deviceId: string;
  status: string;
  timestamp: string;
}

interface ConnectionStatus {
  status: string;
  timestamp: string;
  masterId: number;
}

interface Temperature {
  value: number;
  timestamp: string;
}

interface Command {
  action: string;
  ipAddress?: string;
}

export const useWebSocket = () => {
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus | null>(null);
  const [temperature, setTemperature] = useState<Temperature | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      setIsConnected(true);
      console.log("Connected to WebSocket:", frame);

      // Subscribe to device status
      client.subscribe("/topic/device/status", (message) => {
        try {
          const status = JSON.parse(message.body);
          console.log("Received device status:", status);
          setDeviceStatus(status);
        } catch (err) {
          console.error("Error parsing device status:", err);
        }
      });

      // Subscribe to connection status
      client.subscribe("/topic/connection/status", (message) => {
        try {
          const status = JSON.parse(message.body);
          console.log("Received connection status:", status);
          setConnectionStatus(status);
        } catch (err) {
          console.error("Error parsing connection status:", err);
        }
      });

      // Subscribe to temperature updates
      client.subscribe("/topic/temperature", (message) => {
        try {
          const temp = JSON.parse(message.body);
          console.log("Received temperature:", temp);
          setTemperature(temp);
        } catch (err) {
          console.error("Error parsing temperature:", err);
        }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
      console.log("Disconnected from WebSocket");
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  const sendCommand = (command: Command) => {
    if (clientRef.current?.connected) {
      try {
        console.log("Sending command via WebSocket:", command);
        clientRef.current.publish({
          destination: "/app/device/command",
          body: JSON.stringify(command),
          headers: {},
        });
        console.log("Command sent successfully");
      } catch (error) {
        console.error("Error sending command:", error);
      }
    } else {
      console.error(
        "WebSocket not connected. Current state:",
        clientRef.current
      );
    }
  };
  return {
    deviceStatus,
    connectionStatus,
    temperature,
    isConnected,
    sendCommand,
  };
};
