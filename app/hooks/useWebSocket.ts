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
    // Get the base URL from environment variable
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8081";

    // Make sure it's using HTTP/HTTPS
    const wsBaseUrl = wsUrl
      .replace("ws://", "http://")
      .replace("wss://", "https://");

    console.log("Attempting to connect to WebSocket at:", `${wsBaseUrl}/ws`);

    const client = new Client({
      webSocketFactory: () => {
        // Create SockJS connection using HTTP/HTTPS URL
        const socket = new SockJS(`${wsBaseUrl}`);

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
      onConnect: () => {
        console.log("Successfully connected to WebSocket");
        setIsConnected(true);
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

    // Set up subscriptions when client connects
    client.onConnect = (frame) => {
      console.log("Connected to WebSocket:", frame);
      setIsConnected(true);

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
    if (clientRef.current?.connected) {
      try {
        console.log("Sending command:", command);

        // Stringify the command object
        const payload = JSON.stringify(command);
        console.log("Stringified payload:", payload);

        clientRef.current.publish({
          destination: "/app/device/command",
          body: payload,
          headers: {
            "content-type": "application/json",
          },
        });

        console.log("Command sent successfully");
      } catch (error) {
        console.error("Error sending command:", {
          error,
          command,
          connectionState: clientRef.current.connected,
        });
      }
    } else {
      console.error("WebSocket not connected", {
        connectionState: clientRef.current?.connected,
        client: clientRef.current,
      });
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
