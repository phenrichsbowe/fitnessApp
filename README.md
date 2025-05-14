# Fitness App

A modern fitness tracking application built with Vue 3 and Vuetify, helping you track your workouts and monitor your progress.

## Features

- Track daily workouts and exercises
- View workout progress and statistics
- Categorized exercise management
- Progress charts and achievements
- Responsive design for mobile and desktop

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS)
- pnpm or npm (latest)

## Installation

You can use either pnpm (recommended) or npm to install and run the project.

### Using pnpm (Recommended)

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file in the root directory and add your Supabase configuration:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:
```bash
cd server && pnpm dev
```

### Using npm

1. Install dependencies:
```bash
rm pnpm-lock.yaml && npm install
```

2. Create a `.env` file in the root directory and add your Supabase configuration:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:
```bash
cd server
npm run dev
```

## Building for Production

### Using pnpm

```bash
pnpm build
cd server
pnpm start
```

### Using npm

```bash
npm run build
cd server
npm start
```

## Project Structure

```
fitness-app/
├── src/
│   ├── components/     # Reusable Vue components
│   ├── views/          # Page components
│   ├── stores/         # Pinia stores
│   ├── lib/           # Utility functions and configurations
│   ├── models/        # Data models
│   └── assets/        # Static assets
├── public/            # Public static assets
└── supabase/         # Supabase configurations and migrations
```

## Environment Variables

Required environment variables:

1. Client environment
```env
VITE_SUPABASE_URL=""
VITE_SUPABASE_API_KEY=""
```
2. Server environment

```env
EXPRESS_PORT=3000
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
```

3. Optional
- If your express server is hosted somewhere else set VITE_API_URL to the address where you express server is hosted.