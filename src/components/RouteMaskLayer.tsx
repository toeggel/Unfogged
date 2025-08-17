import { GeoJSON, LayerGroup } from "react-leaflet";
import type { Feature, Polygon, MultiPolygon, FeatureCollection } from "geojson";
import { polygon, union } from "@turf/turf";

export interface BufferedRoute {
  route: Feature<Polygon | MultiPolygon>;
  opacity?: number;
  color?: string;
}

export function RouteMaskLayer({
  mask,
  routes,
  maskColor = "#000",
  maskOpacity = 0.5,
  routeColor = "#000",
  routeOpacity = 0.5,
}: {
  mask: Feature<Polygon | MultiPolygon> | null;
  routes: FeatureCollection<Polygon | MultiPolygon>[];
  maskColor?: string;
  maskOpacity?: number;
  routeColor?: string;
  routeOpacity?: number;
}) {
  let opacityStep = routeOpacity / routes.length;

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
            fillOpacity: opacityStep * idx,
            weight: 0,
          }}
        />
      ))}
    </LayerGroup>
  );
}
