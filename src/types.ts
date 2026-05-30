export interface IoTDevice {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'lock' | 'power' | 'shield' | 'swarm' | 'thruster';
  status: 'on' | 'off' | 'locked' | 'unlocked' | 'active' | 'standby' | 'custom';
  value: string; // temperature, brightness, speed, reactor charge% etc.
  category: 'Home' | 'Defense' | 'Thrusters' | 'Core';
}

export interface JarvisAction {
  type: 'set_iot' | 'create_file' | 'delete_file' | 'system_state' | 'start_countdown' | 'add_task' | 'set_weather';
  target: string;
  value: string;
}

export interface MessageLog {
  id: string;
  text: string;
  speech?: string;
  sender: 'user' | 'jarvis' | 'system';
  timestamp: string;
  actionsTriggered?: JarvisAction[];
  nluScore?: {
    intent: string;
    entities: string;
    confidence: number;
    mode: 'Local Offline' | 'Server NLU (Gemini)';
  };
}

export interface VirtualFile {
  id: string;
  name: string;
  content: string;
  size: number;
  updatedAt: string;
}

export interface SystemStats {
  cpuUsage: number;
  cpuTemp: number;
  memoryUsage: number;
  memoryTotal: number;
  storageUsage: number;
  storageTotal: number;
  arcPower: number; // %
  shieldCharge: number; // %
  thrusterRate: number; // %
  connectionStatus: 'stable' | 'intermittent' | 'stealth' | 'overloaded' | 'offline';
  uptimeSeconds: number;
}

export interface CountdownTrigger {
  id: string;
  title: string;
  duration: number; // seconds
  current: number;
  active: boolean;
  type: 'alert' | 'self-destruct' | 'reactor-purge';
}

export interface SoundEffectOptions {
  type: 'click' | 'success' | 'warning' | 'alert' | 'hologram' | 'chime';
}
