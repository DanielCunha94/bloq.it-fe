# Frontend Engineering Challenge, by Bloqit

## Features

### 🕹 Core Functionalities

- **Comprehensive Pokémon Index**: View all available Pokémon with names and images.
- **Caught Pokémon Tracking**: See which Pokémon you’ve caught and mark them off your list.
- **Detailed Stats & Info**: Access key details on each Pokémon, including:
  - Height, Weight, Health (HP), Speed, Attack, Defense, Special Attack, Special Defense, Types.
  - date of when the Pokémon was added to your Pokédex.
- **Pokémon Sharing**: Easily share your caught Pokémon with fellow Trainers.

### 🔥 Advanced Capabilities

- **Offline Access**: Access your Pokédex with limited or no internet connectivity.
- **Progress Overview**: Quickly visualize your Pokédex progress.
- **Pokédex Management**: Filter, sort, and manage Pokémon with options to:
  - Filter and sort by name, height, type, and timestamp.
  - Remove multiple entries at once.
  - Attach personal notes to each Pokémon.
- **View Modes**: Switch between analytical (table) views and mobile-friendly modes (Cards).
- **Data Export**: Export your entire Pokédex to a CSV for external use.

## Tech Stack

### Core Technologies

- **[SvelteKit](https://kit.svelte.dev/)**
- **TypeScript**

### UI & Styling

- **[Tailwind CSS](https://tailwindcss.com/)**

### Database & ORM

- **[DrizzleORM](https://orm.drizzle.team/)**

### Authentication

- **[Lucia Auth](https://lucia-auth.com/)**

### Tooling & Build System

- **[Vite](https://vitejs.dev/)**

### Testing

- **[Testing Library](https://testing-library.com/)**
- **[Vitest](https://vitest.dev/)**

### Data & API

- **[PokéAPI](https://pokeapi.co/)**
- **[SQLLite](https://www.sqlite.org/)**

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js and npm installed.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/DanielCunha94/bloq.it-fe.git
   ```

2. **Add dependencies**:

   ```bash
   npm i
   ```

3. **Add a .env file**:

   - check .env.example

4. **Setup Drizzle**:

   ```bash
   npm run db:push
   ```

5. **Run**:

   ```bash
   npm run dev
   ```

6. **Run**:
   ```bash
   npm run test
   ```


   
   _Cunha 2024_
