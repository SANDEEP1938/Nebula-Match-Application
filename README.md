# Nebula Match Mobile

React Native (Expo) port of **Nebula Match** — cosmic memory card game with the same backend API as the web MERN app.

## Stack

- **Expo SDK 54** + **React Native 0.81** + **React 19.1**
- **Expo Router** (file-based navigation)
- **React Native Reanimated 4** — card flip, win modal, screen entrances, pulsing cosmic background
- **AsyncStorage** — JWT session (same `nebula_token` key as web)
- **Axios** — REST client to your deployed API

## Features

- Memory game (easy / medium / hard) with animated card flips
- Auth: register, login, forgot password
- Leaderboard and recent wins
- Profile with stats and game history
- Score submit to `/api/game/submit`

## Prerequisites

- **Node.js 20.19+** (required by Expo SDK 54)

## Setup

```bash
cd NebulaMatch
rm -rf node_modules package-lock.json
npm install
npx expo install --fix
cp .env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_API_URL=https://nebula-match.onrender.com/api
```

For local API (simulator):

```env
EXPO_PUBLIC_API_URL=http://localhost:5001/api
```

Use your machine IP instead of `localhost` on a physical device, e.g. `http://192.168.1.10:5001/api`.

## Splash screen

1. Install splash dependency (included in `package.json`):

```bash
npm install
```

2. Add branded image assets (splash + app icon):

```bash
chmod +x scripts/setup-splash-assets.sh
./scripts/setup-splash-assets.sh
```

Or copy `splash.png`, `icon.png`, and `adaptive-icon.png` into `assets/` yourself.

3. The app also shows an **animated cosmic splash** (`NebulaSplash`) with Reanimated while auth loads, then fades into the app.

## Run

```bash
npx expo start --clear
```

Then press `i` (iOS simulator), `a` (Android), or scan the QR code with Expo Go.

## Project layout

```
SANDEEP/NebulaMatch/
├── app/                 Expo Router screens
├── src/
│   ├── api/             Axios client
│   ├── components/      Game board, cards, win modal (Reanimated)
│   ├── context/         Auth
│   ├── hooks/           useMemoryGame
│   ├── theme/           Colors
│   ├── types/
│   └── utils/           gameLogic (ported from web)
└── README.md
```

## Backend

Point `EXPO_PUBLIC_API_URL` at your existing Nebula Match server (Render or local). Ensure `CLIENT_URL` on the server allows your app origin if you use CORS for web; mobile native requests typically do not need CORS.

## Related

- Web app: `../Nebula/` (or repo root `Nebula-Match`)
