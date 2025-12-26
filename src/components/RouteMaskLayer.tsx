import { GeoJSON, LayerGroup } from "react-leaflet";
import type { Feature, MultiPolygon, Polygon } from "geojson";
import { FogRing } from "../routes/buildRouteMask";
import { splitArrayIntoChunks } from "../utils/array-helper";

export const RouteMaskLayer = ({
  mask,
  routes,
  startDate,
  maskColor: color = "#000",
  opacity = 0.9,
}: {
  mask: Feature<Polygon | MultiPolygon> | null;
  routes: FogRing[];
  startDate?: Date;
  maskColor?: string;
  opacity?: number;
}) => {
  const chunks = 10;
  const groups = splitArrayIntoChunks(routes, chunks, startDate);

  if (!mask) {
    return null;
  }

  const opacityStep = opacity / groups.length;

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
      {groups.map((g, i) =>
        g.map((fogRing, idx) => (
          <GeoJSON
            key={`${i}-${idx}`}
            data={fogRing.feature}
            pathOptions={{
              interactive: false,
              fillColor: color,
              fillOpacity: opacityStep * i,
              weight: 0,
            }}
          />
        )),
      )}
    </LayerGroup>
  );
};
