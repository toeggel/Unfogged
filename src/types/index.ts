// This file exports TypeScript types and interfaces used throughout the application.

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface VisitHistory {
  location: LocationData;
  visitTime: Date;
}

export interface FogState {
  isFogged: boolean;
  lastVisited: Date;
}

export interface MapProps {
  fogStates: Record<string, FogState>;
  onLocationUpdate: (location: LocationData) => void;
}
