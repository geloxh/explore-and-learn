### Explore And Learn
A progressive web, desktop, mobile app that serves as NASA platform.

### Project Structure
This is the initial project structure and plan
## Monorepo Architechture
Project architecture guideline:
![alt text](image.png)

## Project folder structure (TurboRepo)
Initial folder structure:
```
nasa-platform/
├── apps/
│   ├── web/              ← React + Vite (browser)
│   ├── desktop/          ← Electron wraps the web app
│   ├── mobile/           ← React Native + Expo
│   └── server/           ← Node.js + Express + Socket.io
├── packages/
│   ├── api-services/     ← all NASA API calls (shared)
│   ├── ui-components/    ← shared React components
│   ├── hooks/            ← shared custom hooks
│   └── types/            ← shared TypeScript interfaces
├── turbo.json
└── package.json
```