import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMockGeolocation } from '../hooks/useMockGeolocation';
import { MOCK_STROLL_ROUTES } from '../mocks/visitedPlaces';

const MapView: React.FC = () => {
    const mapRef = useRef<any>(null);
    const userLocation = useMockGeolocation();

    useEffect(() => {
        if (mapRef.current) {
            // Initialize map settings here if needed
        }
    }, []);

    return (
        <MapContainer 
            center={[47.3769, 8.5417]} // Zurich coordinates
            zoom={13} 
            scrollWheelZoom={false} 
            ref={mapRef}
            className="h-full"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* User location marker */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                    Mocked user location
                </Popup>
            </Marker>
            {/* Stroll routes */}
            {MOCK_STROLL_ROUTES.map((route, idx) => (
                <Polyline
                    key={idx}
                    positions={route.points.map(p => [p.lat, p.lng])}
                    pathOptions={{
                        color: ['#2563eb', '#16a34a', '#f59e42'][idx % 3], // blue, green, orange
                        weight: 5,
                        opacity: 0.7
                    }}
                >
                    <Popup>
                        <strong>{route.name}</strong>
                        <br />
                        {route.description}
                    </Popup>
                </Polyline>
            ))}
        </MapContainer>
    );
};

export default MapView;