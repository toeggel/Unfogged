import { GeoJSON, LayerGroup } from "react-leaflet";
import type { Feature, Polygon, MultiPolygon } from "geojson";
import { polygon } from "@turf/turf";

export function RouteMaskLayer({
  mask,
  routes,
  maskColor = "#000",
  maskOpacity = 0.5,
  routeColor = "#000",
  routeOpacity = 0.2,
}: {
  mask: Feature<Polygon | MultiPolygon> | null;
  routes: Feature<Polygon | MultiPolygon>[];
  maskColor?: string;
  maskOpacity?: number;
  routeColor?: string;
  routeOpacity?: number;
}) {
  if (!mask) return null;

  return (
    <LayerGroup>
      {/* base mask covering the world */}
      <GeoJSON
        data={mask}
        pathOptions={{
          interactive: false,
          fillColor: maskColor,
          fillOpacity: maskOpacity,
          weight: 0,
        }}
      />

      {/* semi-transparent “holes” where routes are */}
      {routes.map((route, idx) => (
        <GeoJSON
          key={idx}
          data={route}
          pathOptions={{
            interactive: false,
            fillColor: routeColor,
            fillOpacity: routeOpacity,
            weight: 0,
          }}
        />
      ))}
    </LayerGroup>
  );
}
