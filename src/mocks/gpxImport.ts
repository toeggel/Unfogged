import { StrollRoute, RoutePoint } from "./visitedPlaces";

/** Remove consecutive duplicates (exact same lat/lng) */
const dedupeConsecutivePoints = (points: RoutePoint[]): RoutePoint[] => {
  return points.filter((p, i, arr) => {
    if (i === 0) return true;
    const prev = arr[i - 1];
    return p.lat !== prev.lat || p.lng !== prev.lng;
  });
};

/**
 * Parses a GPX file (as string or XMLDocument) and returns a StrollRoute object.
 * Only extracts the first <trk> and its <trkseg> points.
 */
export const parseGpxToStrollRoute = async (
  gpxContent: string,
  routeName = "Imported GPX",
): Promise<StrollRoute> => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxContent, "application/xml");

  const name = xml.querySelector("trk > name")?.textContent?.trim() || routeName;
  const description = xml.querySelector("trk > desc")?.textContent?.trim() || undefined;

  const points: RoutePoint[] = [];
  xml.querySelectorAll("trkpt").forEach((pt) => {
    const lat = parseFloat(pt.getAttribute("lat") || "");
    const lng = parseFloat(pt.getAttribute("lon") || "");
    const time = pt.querySelector("time")?.textContent;
    points.push({
      lat,
      lng,
      timestamp: time ? Date.parse(time) : undefined,
    });
  });

  // 🔹 Clean up consecutive duplicates
  const cleanedPoints = dedupeConsecutivePoints(points);
  const simplified = simplifyRoute(cleanedPoints, 0.00001); // tweak epsilon for more/less reduction

  console.log(
    `GPX Import: ${points.length} points, ${cleanedPoints.length} after dedupe, ${simplified.length} after simplification.`,
  );

  return {
    name,
    description,
    points: simplified,
  };
};

/**
 * Simplifies a route using the Ramer–Douglas–Peucker algorithm.
 * @param points Array of RoutePoint
 * @param epsilon Tolerance in degrees (smaller = more points kept)
 */
export const simplifyRoute = (points: RoutePoint[], epsilon: number = 0.0001): RoutePoint[] => {
  if (points.length < 3) {
    return points;
  }

  // Perpendicular distance from point to line (lat/lng, not geodesic)
  const getPerpendicularDistance = (
    pt: RoutePoint,
    lineStart: RoutePoint,
    lineEnd: RoutePoint,
  ): number => {
    const x0 = pt.lng;
    const y0 = pt.lat;
    const x1 = lineStart.lng;
    const y1 = lineStart.lat;
    const x2 = lineEnd.lng;
    const y2 = lineEnd.lat;
    const num = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
    const den = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
    return den === 0 ? 0 : num / den;
  };

  const rdp = (start: number, end: number, pts: RoutePoint[], eps: number, keep: boolean[]) => {
    let maxDist = 0;
    let idx = start;
    for (let i = start + 1; i < end; i++) {
      const dist = getPerpendicularDistance(pts[i], pts[start], pts[end]);
      if (dist > maxDist) {
        maxDist = dist;
        idx = i;
      }
    }
    if (maxDist > eps) {
      keep[idx] = true;
      rdp(start, idx, pts, eps, keep);
      rdp(idx, end, pts, eps, keep);
    }
  };

  const keep = Array(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;
  rdp(0, points.length - 1, points, epsilon, keep);

  return points.filter((_, i) => keep[i]);
};
