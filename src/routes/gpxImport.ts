import { lineString } from "@turf/helpers";
import { RoutePoint, StrollRoute } from "./buildRouteMask";

/**
 * Parses a GPX file (as string or XMLDocument) and returns a StrollRoute object.
 * Only extracts the first <trk> and its <trkseg> points.
 */
export const parseGpxToStrollRoute = async (gpxContent: string, routeName = "Imported GPX"): Promise<StrollRoute> => {
  console.log("parseGpxToStrollRoute" + routeName);
  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxContent, "application/xml");

  const name = xml.querySelector("trk > name")?.textContent?.trim() || routeName;
  const description = xml.querySelector("trk > desc")?.textContent?.trim() || undefined;

  const points: RoutePoint[] = [];
  let timestamp: Date | undefined;
  xml.querySelectorAll("trkpt").forEach((pt) => {
    const lat = parseFloat(pt.getAttribute("lat") || "");
    const lng = parseFloat(pt.getAttribute("lon") || "");
    const time = pt.querySelector("time")?.textContent;
    timestamp = time ? new Date(time) : (timestamp ?? undefined);
    points.push({
      lat,
      lng,
    });
  });

  const simplified = simplifyRoute(points, 10);

  console.log(
    `GPX Import: ${points.length} points, ${simplified.length} after simplification. ${timestamp ? `Timestamp: ${timestamp.toISOString()}` : "No timestamp found."}`,
  );

  return {
    name,
    description,
    points: simplified,
    line: lineString(simplified.map((p) => [p.lng, p.lat])),
    timestamp,
  };
};

/**
 * Simplifies a route using the Ramer–Douglas–Peucker algorithm.
 * @param points Array of RoutePoint
 * @param epsilon Tolerance in meters (smaller = more points kept)
 */
export const simplifyRoute = (points: RoutePoint[], epsilon: number = 10): RoutePoint[] => {
  if (points.length < 3) {
    return points;
  }

  // Perpendicular distance from point to line (in meters)
  const getPerpendicularDistance = (pt: RoutePoint, lineStart: RoutePoint, lineEnd: RoutePoint): number => {
    const latAvg = ((lineStart.lat + lineEnd.lat) / 2) * (Math.PI / 180);
    const meterPerDegLat = 111320;
    const meterPerDegLng = 111320 * Math.cos(latAvg);

    const x1 = (pt.lng - lineStart.lng) * meterPerDegLng;
    const y1 = (pt.lat - lineStart.lat) * meterPerDegLat;
    const x2 = (lineEnd.lng - lineStart.lng) * meterPerDegLng;
    const y2 = (lineEnd.lat - lineStart.lat) * meterPerDegLat;

    const num = Math.abs(y2 * x1 - x2 * y1);
    const den = Math.sqrt(y2 ** 2 + x2 ** 2);

    return den === 0 ? 0 : num / den;
  };

  const keep = Array(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;

  const rdp = (start: number, end: number) => {
    let maxDist = 0;
    let idx = start;
    for (let i = start + 1; i < end; i++) {
      const dist = getPerpendicularDistance(points[i], points[start], points[end]);
      if (dist > maxDist) {
        maxDist = dist;
        idx = i;
      }
    }
    if (maxDist > epsilon) {
      keep[idx] = true;
      rdp(start, idx);
      rdp(idx, end);
    }
  };

  rdp(0, points.length - 1);

  return points.filter((_, i) => keep[i]);
};
