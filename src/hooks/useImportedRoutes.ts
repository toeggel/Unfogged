import { useEffect, useState } from "react";
import { StrollRoute } from "../buildRouteMask";
import { parseGpxToStrollRoute } from "../routes/gpxImport";

/**
 * Loads and parses a list of GPX files into StrollRoute objects.
 * Ensures loading only happens once (even in React Strict Mode).
 */
export const useImportedRoutes = (files: string[]) => {
  const [routes, setRoutes] = useState<StrollRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      files.map((file) =>
        fetch(file)
          .then((res) => res.text())
          .then((gpxText) => parseGpxToStrollRoute(gpxText, file)),
      ),
    )
      .then((routes) => {
        setLoading(false);
        setRoutes(routes);
      })
      .catch((err) => {
        console.error("Failed to load GPX files:", err);
        setRoutes([]);
        setLoading(false);
      });
  }, [files]);

  return { routes, loading };
};
