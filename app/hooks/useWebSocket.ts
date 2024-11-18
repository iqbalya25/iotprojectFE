"use client";
import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { BlowerParameters, TemperatureData } from "../types/types";

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
    const [temperature, setTemperature] = useState<TemperatureData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [blowerParameters, setBlowerParameters] = useState<BlowerParameters | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    // Get the base URL from environment variable with correct domain
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8081";
    console.log("WebSocket base URL:", wsUrl);

    const client = new Client({
      webSocketFactory: () => {
        // Add /ws to the URL
        const sockjsUrl = `${wsUrl}/ws`;
        console.log("Attempting to connect to:", sockjsUrl);

        const socket = new SockJS(sockjsUrl);

        socket.onclose = (event) => {
          console.log("WebSocket connection closed:", event);
          setIsConnected(false);
        };

        socket.onerror = (error) => {
          console.error("WebSocket connection error:", error);
          setIsConnected(false);
        };

        return socket;
      },
      debug: (str) => {
        console.log("WebSocket Debug:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("Successfully connected to WebSocket", frame);
        setIsConnected(true);

        // Move subscriptions here
        if (clientRef.current) {
          // Subscribe to device status
          clientRef.current.subscribe("/topic/device/status", (message) => {
            try {
              const status = JSON.parse(message.body);
              console.log("Received device status:", status);
              setDeviceStatus(status);
            } catch (err) {
              console.error("Error parsing device status:", err);
            }
          });

          // Subscribe to connection status
          clientRef.current.subscribe("/topic/connection/status", (message) => {
            try {
              const status = JSON.parse(message.body);
              console.log("Received connection status:", status);
              setConnectionStatus(status);
            } catch (err) {
              console.error("Error parsing connection status:", err);
            }
          });

          // Subscribe to temperature updates
          clientRef.current.subscribe("/topic/temperature", (message) => {
            try {
              const temp = JSON.parse(message.body);
              console.log("Received temperature:", temp);
              setTemperature(temp);
            } catch (err) {
              console.error("Error parsing temperature:", err);
            }
          });

          clientRef.current.subscribe("/topic/blower/parameters", (message) => {
            try {
              const parameters = JSON.parse(message.body);
              console.log("Received blower parameters:", parameters);
              setBlowerParameters(parameters);
            } catch (err) {
              console.error("Error parsing blower parameters:", err);
            }
          });
        }
      },
      onStompError: (frame) => {
        console.error("STOMP protocol error:", frame);
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        setIsConnected(false);
      },
    });

    try {
      console.log("Activating WebSocket client...");
      client.activate();
      clientRef.current = client;
    } catch (error) {
      console.error("Error activating WebSocket client:", error);
    }

    return () => {
      if (client.active) {
        console.log("Deactivating WebSocket client...");
        client.deactivate();
      }
    };
  }, []);

  const sendCommand = (command: Command) => {
    if (!clientRef.current) {
      console.error("WebSocket client not initialized");
      return;
    }

    if (!clientRef.current.connected) {
      console.error("WebSocket not connected");
      return;
    }

    try {
      console.log("Sending command:", command);
      const payload = JSON.stringify(command);
      console.log("Sending to /app/device/command:", payload);

      clientRef.current.publish({
        destination: "/app/device/command",
        body: payload,
        headers: {
          "content-type": "application/json",
        },
      });

      console.log("Command sent successfully");
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  const sendFrequencyCommand = (frequency: number) => {
    if (!clientRef.current?.connected) {
      console.error("WebSocket not connected");
      return;
    }

    try {
      const command = {
        frequency: frequency
      };
      
      clientRef.current.publish({
        destination: "/app/blower/frequency",
        body: JSON.stringify(command),
      });
      
      console.log("Frequency command sent:", frequency);
    } catch (error) {
      console.error("Error sending frequency command:", error);
    }
  };

  return {
    deviceStatus,
    connectionStatus,
    temperature,
    isConnected,
    sendCommand,
    blowerParameters,
    sendFrequencyCommand,
  };
};
