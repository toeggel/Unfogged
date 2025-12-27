# Unfogged – AI Agent Support Guide

> **Complete implementation status and technical roadmap**

## Overview

This document tracks what's been implemented, what's missing, and the detailed plan to reach the project vision.

For project vision and architecture, see **[project.instructions.md](./instructions/project.instructions.md)**.  
For coding standards, see **[coding.instructions.md](./instructions/coding.instructions.md)**.

## Implemented Features

### Core Infrastructure
- React + Vite + TypeScript: Modern, fast, type-safe setup
- Tailwind CSS: Utility-first styling configured
- Leaflet + React-Leaflet: Map rendering operational
- IndexedDB (localForage): Offline storage configured

### Location & Tracking
- Geolocation hook (`useGeolocation`): Tracks user position
- Live route tracking (`useLiveStrollRoute`): Records active routes
- Route persistence: Saves routes to IndexedDB
- Route storage (`routeStore`): CRUD operations for routes

### Map Features
- Map centering: Centers on user location
- GPX import (`gpxImport`): Loads historical routes
- Route visualization: Displays tracks on map
- Route masking (`buildRouteMask`): Creates fog/unfog polygons
- Fog overlay rendering: Shows visited areas as clear zones
- Graduated fog rings: Multiple fog levels around routes
- Custom map markers: SVG-based position indicator

### Architecture
- Component structure: Modular, well-separated components
- Custom hooks: Reusable logic encapsulation
- Type safety: Strong TypeScript interfaces throughout
- Array utilities: Helper functions for chunking/processing

## Missing Features

### Visual Enhancements
- Heatmap visualization: No visit frequency/brightness indication
- Time-based fog decay: No automatic re-fogging over time
- Viewport optimization: Renders all routes, not just visible ones

### Storage & Performance
- Grid-based tracking: Routes only, no cell-based visit system yet
- Spatial indexing: No geohash or R-tree for fast lookups
- Batch updates: No batching of IndexedDB writes
- Lazy loading: All components load eagerly

### PWA Features
- Service worker: No offline tile caching
- Manifest optimization: Basic manifest exists but not tuned
- Install prompts: No PWA install guidance
- Background sync: No sync when online after offline use

### UX & Settings
- Settings UI: No configuration interface
- Onboarding: No first-time user guidance
- Exploration suggestions: No "where to explore next" feature
- Statistics: No visit counts, distance traveled, etc.

### Battery & Privacy
- Location throttling: No configurable update intervals
- Tracking pause/resume: Can't manually pause tracking
- Battery optimization: No adaptive tracking based on battery

## Detailed Roadmap

### Phase 1: Core Fog System (Grid-Based)

#### 1.1 Grid Infrastructure
```typescript
interface FogCell {
  id: string;        // Geohash or "lat_lng"
  lat: number;
  lng: number;
  lastVisit: Date;
  visitCount: number;
  fogState: FogState;
}

type FogState = 'clear' | 'light' | 'medium' | 'full';
```

**Tasks:**
- [ ] Create `fogStore.ts` for cell CRUD operations
- [ ] Implement geohash-based cell ID generation
- [ ] Build cell visit logging on location updates
- [ ] Create fog state calculation logic (time decay)

#### 1.2 Fog Rendering
**Tasks:**
- [ ] Build viewport-based cell query
- [ ] Create canvas-based fog overlay renderer
- [ ] Implement fog opacity based on time since visit
- [ ] Add brightness/heatmap based on visit frequency

#### 1.3 Performance Optimization
**Tasks:**
- [ ] Batch IndexedDB writes (queue + flush)
- [ ] Spatial index for viewport queries
- [ ] Memoize expensive fog calculations
- [ ] Lazy load fog layers outside viewport

### Phase 2: PWA & Offline

#### 2.1 Service Worker
**Tasks:**
- [ ] Set up Workbox for tile caching
- [ ] Cache static assets (JS, CSS, images)
- [ ] Implement tile cache strategy (cache-first)
- [ ] Add cache size limits and expiration

#### 2.2 Manifest & Installability
**Tasks:**
- [ ] Optimize `manifest.webmanifest` (icons, theme)
- [ ] Add install prompt UI
- [ ] Handle iOS add-to-homescreen

#### 2.3 Background Sync
**Tasks:**
- [ ] Queue route uploads when offline
- [ ] Sync when connection restored
- [ ] Handle sync conflicts

### Phase 3: UX & Settings

#### 3.1 Settings UI
```typescript
interface AppSettings {
  fogDecayDays: number;      // Days until full re-fog
  cellSizeMeters: number;     // Grid cell size
  locationUpdateInterval: number; // ms between updates
  trackingEnabled: boolean;
}
```

**Tasks:**
- [ ] Create settings component
- [ ] Persist settings to IndexedDB
- [ ] Apply settings to fog logic
- [ ] Add preset options (battery saver, max detail, etc.)

#### 3.2 Onboarding & Help
**Tasks:**
- [ ] First-time user tutorial
- [ ] Explain fog concept
- [ ] Location permission education
- [ ] Interactive demo

#### 3.3 Statistics & Insights
**Tasks:**
- [ ] Total distance traveled
- [ ] Unique cells visited
- [ ] Exploration percentage (of region)
- [ ] Time since last visit per area

### Phase 4: Advanced Features

#### 4.1 Exploration Suggestions
**Tasks:**
- [ ] Identify nearby unvisited areas
- [ ] Suggest routes to explore
- [ ] Highlight "forgotten" areas (visited long ago)
- [ ] Generate optimal exploration paths

#### 4.2 Gamification
**Tasks:**
- [ ] Achievements (100 cells, 1000km, etc.)
- [ ] Streaks (consecutive days exploring)
- [ ] Challenges (visit 10 new areas this week)

#### 4.3 Social Features (Optional)
**Tasks:**
- [ ] Export fog map as image
- [ ] Share exploration stats
- [ ] Compare fog maps with friends (privacy-preserving)

## Next Steps (Priority Order)

1. **Implement grid-based fog system** (Phase 1.1)
   - Most impactful for core vision
   - Enables all future fog features

2. **Add fog decay logic** (Phase 1.1)
   - Makes exploration continuous
   - Encourages revisiting

3. **Optimize rendering performance** (Phase 1.3)
   - Essential for mobile experience
   - Enables scaling to large areas

4. **Build settings UI** (Phase 3.1)
   - User control over experience
   - Enables battery/privacy options

5. **Add PWA caching** (Phase 2.1)
   - True offline experience
   - Critical for outdoor use

## Related Documentation

- [Project Vision & Architecture](./instructions/project.instructions.md)
- [Coding Guidelines](./instructions/coding.instructions.md)
- [Main Copilot Instructions](./copilot-instructions.md)

