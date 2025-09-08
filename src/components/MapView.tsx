import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { buildRouteMask } from "../buildRouteMask";
import { RouteMaskLayer } from "./RouteMaskLayer";
import { latLng } from "leaflet";
import { useImportedRoutes } from "../hooks/useImportedRoutes";

const MAP_CENTER_GUGGACH = latLng(47.401263, 8.533942);
const FOG_RADIUS_METERS = 60;
const FOG_LEVELS = 1;
const GPX_FILES = [
  "routes/Workout-2021-08-21-16-51-18.gpx",
  "routes/Workout-2023-07-27-15-57-27.gpx",
  "routes/Workout-2023-08-03-17-11-26.gpx",
  "routes/Workout-2023-08-10-15-36-57.gpx",
  "routes/Workout-2023-12-19-10-55-33.gpx",
  "routes/Workout-2024-07-16-16-07-28.gpx",
  "routes/Workout-2025-07-17-16-12-28.gpx",
  "routes/Workout-2025-08-16-10-28-36.gpx",
  "routes/Workout-2025-09-03-19-54-14.gpx",
];

export const MapView: React.FC = () => {
  const userLocation = MAP_CENTER_GUGGACH;
  const importedRoutes = useImportedRoutes(GPX_FILES);

  const mask = useMemo(
    () => buildRouteMask(importedRoutes, FOG_RADIUS_METERS, FOG_LEVELS),
    [importedRoutes],
  );

  if (!importedRoutes.length) {
    return <div>Loading GPX data…</div>;
  }

  return (
    <MapContainer center={MAP_CENTER_GUGGACH} zoom={15} style={{ height: "100vh" }}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Esri Satellite">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.BaseLayer>
      </LayersControl>
      <RouteMaskLayer mask={mask.mask} routes={mask.fogRings} />
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>Mocked user location</Popup>
      </Marker>
    </MapContainer>
  );
};
