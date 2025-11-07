# Tracksit 📦

Tracksit is a lightweight inventory tracking app built with Expo that helps you log items, categorize them, and keep tabs on where everything lives. It is designed for quick data entry and flexible filtering so you can stay on top of your gear, supplies, or collectibles.

## Features

- Item management with create, update, and archive flows
- Location and category tagging for every item
- Quick search and filter tools for faster lookups
- Configurable option lists for categories, locations, and statuses
- Responsive UI tuned for both mobile and tablet layouts

## Architecture & Tooling

- Expo + React Native powered by `expo-router` for file-based navigation
- Context-based state management via custom providers in `app/context`
- Component-driven UI with reusable building blocks in `app/components`
- TypeScript for type safety and predictable data models
- React Hook Form and Zod validation for robust form handling

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npx expo start
   ```

3. Open the project using Expo Go, an emulator, or a development build as prompted.

## Project Layout

- `app/` – screens, routes, and UI components
- `app/context/` – contexts, reducers, and initial data
- `app/components/` – shared visual components and form controls
- `app/tabs/` – tab-based routing views for managing and browsing items

## Further Reading

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router guide](https://docs.expo.dev/router/introduction/)
- [React Native docs](https://reactnative.dev/docs/getting-started)
