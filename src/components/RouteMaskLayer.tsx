import { GeoJSON, LayerGroup } from "react-leaflet";
import type { Feature, Polygon, MultiPolygon } from "geojson";

export interface BufferedRoute {
  route: Feature<Polygon | MultiPolygon>;
  opacity?: number;
  color?: string;
}

export const RouteMaskLayer = ({
  mask,
  routes,
  maskColor: color = "#000",
  opacity = 0.9,
}: {
  mask: Feature<Polygon | MultiPolygon> | null;
  routes: Feature<Polygon | MultiPolygon>[];
  maskColor?: string;
  opacity?: number;
}) => {
  let opacityStep = opacity / (routes.length + 1);

  if (!mask) {
    return null;
  }

  return (
    <LayerGroup>
      <GeoJSON
        data={mask}
        pathOptions={{
          interactive: false,
          fillColor: color,
          fillOpacity: opacity,
          weight: 0,
        }}
      />

      {/* level of fog rings */}
      {routes.map((route, idx) => (
        <GeoJSON
          key={idx}
          data={route}
          pathOptions={{
            interactive: false,
            fillColor: color,
            fillOpacity: opacityStep * (idx + 1),
            weight: 0,
          }}
        />
      ))}
    </LayerGroup>
  );
};
