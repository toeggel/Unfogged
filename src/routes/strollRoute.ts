export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp?: number; // Optional: when the user passed this point
}

export interface StrollRoute {
  name: string;
  description?: string;
  points: RoutePoint[];
}