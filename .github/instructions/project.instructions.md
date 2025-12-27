# Unfogged – Project Vision & Architecture

## Vision

**Unfogged** is a progressive web app that gamifies urban and natural exploration through a "fog of war" map interface:

- **Unfogged areas**: Recently visited locations appear clear and visible
- **Fogged areas**: Unvisited or long-forgotten places are obscured
- **Brightness/intensity**: Frequently visited areas stay brighter
- **Exploration incentive**: Users discover new places and rediscover forgotten ones

This is a personal exploration tool that works offline and encourages mindful discovery of local environments.

## Technical Stack

### Core Technologies
- **Runtime**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS (utility-first)
- **Mapping**: Leaflet.js + React-Leaflet
- **Storage**: IndexedDB via `localForage` (offline-first)
- **PWA**: Service Worker + Web Manifest

### Deployment Options
- **Static**: GitHub Pages (current)

### Design Principles
- **Offline-first**: Full functionality without network
- **Mobile-first**: Touch-optimized, installable PWA
- **Performance**: Fast on low-end devices
- **Privacy**: GPS data stays local, opt-in tracking
- **Battery-conscious**: Throttled location updates

## Architecture

### Project Structure
```
src/
├── components/        # React components (UI & map)
├── hooks/            # Custom React hooks
├── routes/           # Route/path processing logic
├── storage/          # IndexedDB abstractions
├── map/              # Map utilities & config
├── utils/            # Generic helpers
└── styles/           # Global CSS
```

### Key Patterns
- **Component composition**: Small, focused, reusable components
- **Custom hooks**: Encapsulate side effects and state logic
- **Separation of concerns**: UI, logic, and data layers are distinct
- **Type safety**: Strong TypeScript types throughout

## Key Features

### Implemented
- Route tracking and visualization
- GPX import and display
- Live location tracking
- Grid-based fog logic
- Viewport-based rendering
- IndexedDB persistence

### Planned
- Offline map tile caching
- PWA installability
- Settings UI (grid size, decay rates, misc constants)
- Exploration suggestions
- Battery optimizations

## Development Priorities

1. **Code quality**: Clean, readable, maintainable
2. **Type safety**: Leverage TypeScript fully
3. **Performance**: 60fps on mobile, fast startup
4. **User experience**: Intuitive, delightful interactions
5. **Offline reliability**: Works without network

## Related Documentation

- [Coding Guidelines](./coding.instructions.md) - Code style and best practices
- [AI Agent Support](../AI_AGENT_SUPPORT.md) - Implementation status and roadmap

