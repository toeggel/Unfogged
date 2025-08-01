import React, { useEffect, useRef, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMockGeolocation } from '../hooks/useMockGeolocation';
import { MOCK_STROLL_ROUTES, StrollRoute } from '../mocks/visitedPlaces';
import { parseGpxToStrollRoute } from '../mocks/gpxImport';
import * as turf from '@turf/turf';

// Define the bounds of your map area (Zurich bounding box)
const MAP_BOUNDS: [number, number][] = [
    [47.35, 8.40], // SW
    [47.35, 8.60], // SE
    [47.50, 8.60], // NE
    [47.50, 8.40], // NW
];

const FOG_RADIUS_METERS = 60; // Radius around each visited point to "unfog"

const MapView: React.FC = () => {
    const mapRef = useRef<any>(null);
    const userLocation = useMockGeolocation();

    // State for imported GPX routes
    const [importedRoutes, setImportedRoutes] = useState<StrollRoute[]>([]);

    // Example: Load a GPX file from the mocks folder on mount (for demo purposes)
    useEffect(() => {
        // You can replace this with a file picker or fetch as needed
        fetch('/src/mocks/Workout-2025-07-17-16-12-28.gpx')
            .then(res => res.text())
            .then(gpxText => parseGpxToStrollRoute(gpxText, "Imported GPX Route"))
            .then(route => setImportedRoutes([route]))
            .catch(() => setImportedRoutes([]));
    }, []);

    // Combine all routes (mocked + imported)
    const allRoutes = useMemo(
        () => [...MOCK_STROLL_ROUTES, ...importedRoutes],
        [importedRoutes]
    );

    // Compute "holes" in the fog for each route point
    const fogHoles = useMemo(() => {
        const holes: [number, number][][] = [];
        let points = allRoutes.map(p => p.points);

        allRoutes.forEach(route => {
            if (points.length > 1) {
                const line = turf.lineString(route.points.map(p => [p.lng, p.lat]));
                const buffered = turf.buffer(line, FOG_RADIUS_METERS, { units: 'meters' });
                // Convert GeoJSON polygon to Leaflet lat/lng array
                turf.getCoords(buffered).forEach((ring: [number, number][]) => {
                    holes.push(ring.map(([lng, lat]) => [lat, lng]));
                });
            } else if (route.points.length === 1) {
                // Single point: fallback to a circle
                const pt = route.points[0];
                const circle: [number, number][] = [];
                for (let i = 0; i < 32; i++) {
                    const angle = (2 * Math.PI * i) / 32;
                    const dLat = (Math.cos(angle) * FOG_RADIUS_METERS) / 111320;
                    const dLng = (Math.sin(angle) * FOG_RADIUS_METERS) / (40075000 * Math.cos(pt.lat * Math.PI / 180) / 360);
                    circle.push([pt.lat + dLat, pt.lng + dLng]);
                }
                holes.push(circle);
            }
        });
        

        return holes;
    }, [allRoutes]);

    return (
        <MapContainer
            center={[47.3769, 8.5417]}
            zoom={13}
            scrollWheelZoom={true}
            ref={mapRef}
            className="h-full"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Fog of war polygon with merged holes */}
            <Polygon
                positions={[MAP_BOUNDS, ...fogHoles]}
                pathOptions={{
                    color: 'none',
                    fillColor: '#111',
                    fillOpacity: 0.92,
                    stroke: false,
                }}
            />            
            <Polygon
                positions={[...fogHoles]}
                pathOptions={{
                    color: 'none',
                    fillColor: '#111',
                    fillOpacity: 0.80,
                    stroke: false,
                }}
            />
            <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                    Mocked user location
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapView;