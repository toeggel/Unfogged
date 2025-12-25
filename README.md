# Unfogged PWA

Unfogged is a Progressive Web App (PWA) designed to help users explore their surroundings by visualizing areas they have visited over time. The app features a "fog of war"-style map that reveals visited areas while keeping unvisited areas obscured, encouraging mindful exploration.

## Features

- Interactive map with "fog of war" effect (Leaflet + React-Leaflet)
- Tracks your location (with permission) and reveals visited areas
- Areas not visited for a while become fogged again
- Frequently visited places stay bright and visible
- Offline-first: stores your visit history and map data locally (IndexedDB via localForage)
- Mobile-first, installable as a PWA
- Fast, lightweight, and privacy-friendly

## Getting Started

To get started with the Unfogged PWA, follow these steps:

1. Install dependencies:

   ```
   npm install
   ```

2. Run the development server:

   ```
   npm run dev
   ```

3. Open your browser:  
   Navigate to `http://localhost:5173` to view the application.

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (planned)
- [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- [localForage](https://localforage.github.io/localForage/) for offline storage
- [ESLint](https://eslint.org/) for code quality

## Fog Logic (Planned)

- Areas are “unfogged” as you visit them.
- Areas fade back to fog if not visited for a configurable time.
- Heatmap/brightness for frequently visited places.
- All logic runs locally for privacy.

## Development Notes

- Uses modern React (v19+), Vite, and ES modules.
- Offline-first: all data is stored in the browser.
- Map tiles and data caching for offline use (planned).
- PWA installable on mobile and desktop.

## Deployment

- Static build can be deployed to GitHub Pages or Azure Static Web Apps.
