# Unfog Map – AI Agent Support Guide

## 🧭 Project Vision

The app encourages urban or natural exploration by tracking user movement and gradually revealing a "fog of war"-style map:
- Areas the user visits are "unfogged" and become visible.
- Areas not visited for a long time become fogged again.
- Frequently visited places stay bright and visible.
- The map gives users an intuitive sense of where they’ve been — and importantly — where they *haven’t*.

The user wants this as a personal tool to discover new places in their local environment. It should work offline and ideally encourage mindful exploration by highlighting “unfamiliar” or less-visited areas when planning a walk or stroll.

## 🧰 Technical Stack
- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Map rendering:** Leaflet.js with React-Leaflet
- **Storage:** IndexedDB via `localForage` (offline-first)
- **Deployment:**
   - If static-only: GitHub Pages
   - If backend needed later: Azure Static Web Apps + Azure Functions
- **Form factor:** Progressive Web App (PWA), installable, mobile-first UX
- **Offline Mode:** Full offline usability required. Must cache map tiles and location data.

## 🔧 Key Features
- Track user location periodically (when granted and active)
- Render fog/unfog states on a map
- Store visit history and timestamps locally
- Auto-refog areas based on elapsed time
- Prioritize exploration of unknown/forgotten areas
- Respect battery and privacy (GPS should not be always-on; batching allowed)
- Optional background sync or cloud backup in future versions

## 👤 AI Agent Role
- Help design a modular, clean architecture
- Suggest React component structures and Tailwind design choices
- Guide efficient offline data handling (e.g., IndexedDB, caching)
- Propose smart algorithms for fog logic (e.g., decay rates, visit heatmaps)
- Optimize for performance on low-end mobile devices
- Provide ideas for future features (gamification, social, analysis)
- Always balance developer efficiency with user experience

## ✅ What Is Already Implemented
- React + Vite + TypeScript: Modern, fast, and type-safe setup.
- Tailwind CSS: Installed and configured for utility-first styling.
- Leaflet + React-Leaflet: Map rendering is working.
- Location Tracking: Custom hook (`useLocationTracker`) tracks user’s geolocation and persists the last position in IndexedDB (via localForage).
- Map Centering: The map centers on the user’s current position.
- Component Structure: Modular, with clear separation (App, MapView, hooks).
- Offline Storage: localForage is set up for storing location data.
- **Grid-based fog logic:** The map is divided into a configurable grid (default 10x10 meters). Each location update logs a visit to the corresponding cell in IndexedDB.
- **Fog overlays:** The map displays fog/unfog overlays for each cell, with color/opacity based on fog state (unfogged, partial, fogged). Fog state is determined by last visit time.
- **Viewport-based rendering:** Only cells in the current map viewport are loaded and rendered for performance.

## ❌ What’s Missing (Compared to Vision)
- **Heatmap/Brightness:** No visual indication of frequently visited areas (visit count not yet visualized).
- **Efficient Storage:** No batching or grid-based storage optimizations for large areas.
- **Map Tile Caching:** No offline map tile caching yet.
- **Battery/Privacy Optimization:** No batching or throttling of GPS polling.
- **PWA Features:** No manifest, service worker, or installability.
- **UI/UX:** No onboarding, settings, or exploration suggestions.
- **Settings:** No UI to configure grid size, fog decay, or other parameters.

## 🗺️ Detailed Plan to Reach the Vision

1. **Grid System for Fog Tracking**
   - Divide the map into a grid (e.g., 10x10m cells, configurable).
   - Each cell will have a unique ID and store visit data.

2. **Visit Logging**
   - On each location update, determine the current cell.
   - Store/update the last visit timestamp and visit count for that cell in IndexedDB.

3. **Fog State Calculation**
   - For each cell, calculate its fog state:
      - Unfogged: recently visited.
      - Partially fogged: visited, but not recently.
      - Fully fogged: never or long ago visited.
   - Optionally, use visit count for brightness/heatmap.

4. **Fog Overlay Rendering**
   - Render a semi-transparent overlay for each cell based on its fog state.
   - Use React-Leaflet’s Rectangle or a custom canvas layer for performance.
   - Only render cells in the current viewport.

5. **Fog Decay Logic**
   - On app load or periodically, update fog states based on elapsed time since last visit.

6. **Efficient Storage & Performance**
   - Batch updates to IndexedDB.
   - Only load/store cells in/near the current viewport.
   - Consider using a spatial index or geohash for fast lookups.

7. **Map Tile Caching (Offline)**
   - Integrate a service worker to cache map tiles for offline use.
   - Optionally, prefetch tiles for frequently visited areas.

8. **PWA Features**
   - Add a manifest and service worker for installability and offline support.

9. **UI/UX Enhancements**
   - Add onboarding to explain the fog concept.
   - Add settings for fog decay rate, cell size, etc.
   - Suggest unexplored/forgotten areas to the user.

10. **Battery & Privacy**
   - Throttle/batch location updates.
   - Allow users to pause tracking.

## 📝 Next Steps (Suggested Order)

1. Visualize visit frequency (heatmap/brightness) for each cell.
2. Optimize storage and rendering for performance at scale.
3. Add PWA and offline map tile caching.
4. Add UI for settings (grid size, fog decay, etc).
5. Enhance onboarding and exploration suggestions.
