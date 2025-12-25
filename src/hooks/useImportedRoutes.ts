import { useEffect, useState } from "react";
import { StrollRoute } from "../routes/buildRouteMask";
import { parseGpxToStrollRoute } from "../routes/gpxImport";
import { getRoute, saveRoute } from "../storage/routeStore";

/**
 * Loads GPX files and caches parsed StrollRoute objects in IndexedDB.
 * Each file is only parsed once; cached routes are reused.
 */
export const useImportedRoutes = (files: string[]) => {
  const [routes, setRoutes] = useState<StrollRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!files.length) {
      setRoutes([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadRoutes = async () => {
      try {
        const results: StrollRoute[] = [];

        for (const file of files) {
          const cached = await getRoute(file);
          if (cached) {
            results.push(cached);
            continue;
          }

          const res = await fetch(file);
          const gpxText = await res.text();
          const parsed = await parseGpxToStrollRoute(gpxText, file);

          await saveRoute(file, parsed);

          results.push(parsed);
        }

        if (!cancelled) {
          setRoutes(results);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load GPX files:", err);
        if (!cancelled) {
          setRoutes([]);
          setLoading(false);
        }
      }
    };

    loadRoutes();

    return () => {
      cancelled = true;
    };
  }, [files]);

  return { routes, loading };
};
