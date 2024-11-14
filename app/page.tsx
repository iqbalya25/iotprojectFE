"use client";

import DeviceMonitor from "./components/DeviceMonitor";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">IoT Device Monitor</h1>
      <DeviceMonitor />
    </main>
  );
}
