export interface Master {
    id: number;
    masterName: string;
    masterIpAddress: string;
    masterPort: number;
    plcId: number;
    masterLocation: string;
  }
  
  export interface DeviceStatus {
    deviceId: string;
    status: string;
    timestamp: string;
  }
  
  export interface ConnectionStatus {
    status: string;
    timestamp: string;
    masterId: number;
  }
  
  export interface Temperature {
    value: number;
    timestamp: string;
  }

  export interface TemperatureData {
    value: number;
    timestamp: string;
  }
  
  export interface TemperatureChartProps {
    data: TemperatureData[];
    title: string;
    type: 'realtime' | 'historical';
  }

  export interface BlowerParameters {
    frequency: number;
    ampere: number;
    voltage: number;
    timestamp: string;
    deviceId: string;
    masterId: number;
  }