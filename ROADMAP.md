# AR School – Project Progress & Roadmap

## 🎯 What We Have Done (Progress So Far)

### 1. Core Architecture & UI
- **Framework**: Initialized the project using Next.js 14 (App Router) and TypeScript.
- **Styling**: Built a premium, fully responsive "Glassmorphism" UI system using Tailwind CSS and Framer Motion for micro-animations.
- **Navigation**: Implemented a persistent, animated Bottom Navigation bar, fixing Z-index overlaps and ensuring all scrollable pages have proper bottom padding.

### 2. WebXR & 3D Integration
- **3D Rendering**: Integrated `Three.js` and `React Three Fiber` (`@react-three/fiber`, `@react-three/drei`) to render `.glb`/`.gltf` educational models.
- **True AR Mode**: 
  - Bridged the WebXR `immersive-ar` session directly into the WebGL context to perfectly merge the physical camera feed with the 3D scene.
  - Implemented custom Touch Gesture Controls (Swipe to Rotate/Move, Pinch to Scale) for manipulating models in physical space.
  - Resolved physical space tracking bugs by isolating and disabling `OrbitControls` during AR sessions.

### 3. Gamification Engine
- Built a robust mock Gamification engine (`src/lib/gamification.ts`).
- Implemented **XP Tracking & Leveling Formulas**.
- Created **Badges/Achievements** system with locked/unlocked visual states.
- Implemented **Daily Quests** and Local/Global **Leaderboards**.
- *Fix applied*: Resolved a critical React hydration crash preventing Vercel deployment by standardizing dynamic timestamps.

### 4. AI & Deployment Readiness
- **AI Assistant**: Built an OpenAI-powered Chat UI with automatic error-handling that gracefully falls back to a rich local offline database if the API fails or is unconfigured.
- **PWA Capabilities**: Installed and configured `@ducanh2912/next-pwa` so the application can be installed natively to mobile device Home Screens with Service Worker caching.
- **Version Control**: Successfully set up Git and pushed all code to the central GitHub repository.

---

## 🚀 What Is To Be Done (Future Features)

### Phase 1: Interactive Learning (Immediate Next Steps)
1. **Interactive AR Info Labels**: The "Info" button in the AR view currently does nothing. We need to allow users to tap specific parts of a 3D model (e.g., tapping the "Aorta" on a heart) to bring up educational tooltips.
2. **Context-Aware AI Assistant**: Bridge the AI chat into the AR view so students can ask questions *while* looking at the model.

### Phase 2: Advanced AR Mechanics
3. **True Surface Hit-Testing**: Currently, the AR model spawns exactly 1.5 meters in front of the camera. We need to implement surface detection so users can physically place the model on a table or the floor.
4. **Dynamic Model Swapping**: Update the placeholder robot model to load the actual scientifically accurate `.glb` models based on the selected topic (e.g., a real Heart, Solar System, Engine).

### Phase 3: Backend & Multiplayer
5. **Persistent Database**: Move the mock gamification data to a real backend so user progress (XP, streaks, unlocked badges) saves across devices.
6. **Live Competitive Quizzes**: Expand the quiz system to allow students to compete in real-time against friends or global players.

---

## 🛠️ How We Will Do It (Implementation Strategy)

### 1. Info Labels & Raycasting
- We will utilize **Three.js Raycaster** combined with `onClick` handlers on the GLTF model meshes. 
- When a user taps a mesh, we will use `@react-three/drei`'s `<Html>` component to anchor a sleek Tailwind CSS tooltip directly to the 3D coordinate of the tapped part.

### 2. Surface Hit-Testing
- We will install the `@react-three/xr` library, which natively supports WebXR hit-testing.
- We will render a targeting reticle on detected physical planes (floors/tables). When the user taps the screen, an anchor will be created at the reticle's location, dropping the model realistically onto the surface.

### 3. Backend Integration
- **Tech Stack**: We will integrate **Supabase** (PostgreSQL) paired with **Prisma ORM**.
- **Auth**: We will use NextAuth.js or Supabase Auth for student login.
- **Data Mutation**: We will use Next.js 14 Server Actions to securely fetch and update user XP, Quiz results, and Leaderboard rankings without exposing API endpoints.

### 4. Live Multiplayer Quizzes
- We will leverage Supabase Realtime (WebSockets) to sync game state between connected clients, allowing users to see their competitors' scores update instantly during a quiz challenge.
