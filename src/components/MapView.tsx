import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMockGeolocation } from "../hooks/useMockGeolocation";
import { MOCK_STROLL_ROUTES, StrollRoute } from "../mocks/visitedPlaces";
import { parseGpxToStrollRoute } from "../mocks/gpxImport";
import { buildRouteMask } from "../buildRouteMask";
import { RouteMaskLayer } from "./RouteMaskLayer";
import { latLng } from "leaflet";

const FOG_RADIUS_METERS = 30;
const FOG_LEVELS = 2;
const MAP_CENTER_GUGGACH = latLng(47.401344, 8.534294);

const MapView: React.FC = () => {
  const userLocation = useMockGeolocation();

  const [importedRoutes, setImportedRoutes] = useState<StrollRoute[]>([]);

  useEffect(() => {
    const files = [
      "/src/mocks/Workout-2025-07-17-16-12-28.gpx",
      "/src/mocks/Workout-2025-08-16-10-28-36.gpx",
    ];

    Promise.all(
      files.map((file) =>
        fetch(file)
          .then((res) => res.text())
          .then((gpxText) => parseGpxToStrollRoute(gpxText, file)),
      ),
    )
      .then((routes) => setImportedRoutes(routes))
      .catch((err) => {
        console.error("Failed to load GPX files:", err);
        setImportedRoutes([]);
      });
  }, []);

  const allRoutes = useMemo(() => {
    return [...importedRoutes, ...MOCK_STROLL_ROUTES];
  }, [importedRoutes]);

  const mask = useMemo(() => buildRouteMask(allRoutes, FOG_RADIUS_METERS, FOG_LEVELS), [allRoutes]);

  if (!importedRoutes.length) {
    return <div>Loading GPX data…</div>;
  }

  return (
    <MapContainer center={MAP_CENTER_GUGGACH} zoom={20} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RouteMaskLayer mask={mask.mask} routes={mask.fogRings} />
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>Mocked user location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
