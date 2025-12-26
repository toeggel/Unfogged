import { GeoJSON, LayerGroup } from "react-leaflet";
import type { Feature, Polygon, MultiPolygon } from "geojson";
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
  // startDate = new Date("2025-04-01");
  let groups = splitArrayIntoChunks(
    routes
      .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
      .map((r) => ({ feature: r.feature, date: r.date })),
    10,
    startDate,
  );

  const opacityStep = opacity / groups.length;

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
      {groups.map((g, i) => {
        const opacity = opacityStep * i;

        return g.map((fogRing, idx) => {
          return (
            <GeoJSON
              key={idx}
              data={fogRing.feature}
              pathOptions={{
                interactive: false,
                fillColor: color,
                fillOpacity: opacity,
                weight: 0,
              }}
            />
          );
        });
      })}
    </LayerGroup>
  );
};
