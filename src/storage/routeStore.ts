import localforage from "localforage";
import { StrollRoute } from "../routes/buildRouteMask";

const routeStore = localforage.createInstance({
  name: "Unfogged",
  storeName: "routes",
});

export async function saveRoute(key: string, route: StrollRoute): Promise<void> {
  await routeStore.setItem(key, route);
}

export async function getRoute(key: string): Promise<StrollRoute | null> {
  return (await routeStore.getItem<StrollRoute>(key)) ?? null;
}

export async function getAllRoutes(): Promise<StrollRoute[]> {
  const routes: StrollRoute[] = [];
  await routeStore.iterate<StrollRoute, void>((value) => {
    if (value) routes.push(value);
  });
  return routes;
}
