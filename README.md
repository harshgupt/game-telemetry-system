GAME TELEMETRY DASHBOARD
PROJECT OVERVIEW

The Game Telemetry Dashboard is a full-stack web application designed to visualize real-time telemetry data from slot and arcade games.

It enables users to monitor and analyze key performance indicators such as total spins, bets, winnings, RTP (Return to Player), average bet, and daily active users (DAU).
The system also includes hourly performance trends, leaderboards for top games and terminals, and a recent events log.

The backend handles telemetry ingestion and KPI aggregation, while the frontend provides a clean and responsive dashboard interface for visualization. A seed code is also included to generate and upload mock data.

TECHNOLOGY STACK

Frontend: React (Vite), TypeScript, Axios, Recharts
Backend: Node.js, Express.js, TypeScript, Mongoose
Database: MongoDB Atlas
Styling: Custom CSS theme based on Canva color palette
Utilities: tsx, dotenv, cors

INSTALLATION AND SETUP

Clone the Repository:
git clone https://https://github.com/harshgupt/game-telemetry-system
cd game-telemetry-system

BACKEND SETUP

cd server
npm install
copy .env.example .env

Then create the build and start the server:
npm run build
npm start

Expected console output:
Connected to MongoDB
Server running on port 5000

FRONTEND SETUP

cd ../web
npm install
copy .env.example .env
npm run dev

The frontend will start at:
http://localhost:5173 (If the port is being used, a new one will be generated)

SEEDING MOCK DATA

To populate the MongoDB Atlas database with sample telemetry data, run:

cd ../server
npm install --save-dev ts-node typescript
npx tsc
node dist/seed.js

This command uses the tsx runtime to execute src/seed.ts and insert randomized GameEvent 400 entries into the database.
Each event contains realistic but random combinations of bets, wins, timestamps, and game/terminal identifiers. It also clears the data already present in the database.

API ENDPOINTS

Base URL (local): http://localhost:5000

/events (GET)

Fetch all game events. Supports optional filters for time, gameId, and terminalId.

/events/recent (GET)

Fetch the 10 most recent game events.

/kpis (GET)

Retrieve calculated KPIs including total spins, total bet, total winnings, RTP, average bet, DAU, and top performers.

/kpis/hourly (GET)

Retrieve hourly trends for spins, total bet, and total winnings (last 24 hours).

Example query parameters:
?gameId=game_01&terminalId=terminal_05&startTime=2025-10-01&endTime=2025-10-31

DASHBOARD FEATURES

Filter Bar

Filters data by Game ID, Terminal ID, and custom date range.

Includes Reset button to clear all filters.

KPI Board

Displays total spins, total bet (USD), total winnings (USD), RTP (%), average bet, and DAU.

Also includes Top Games and Top Terminals tables, ranked by total bet.

Chart Board

Line chart for hourly trends (spins, bet, winnings).

Two bar charts for top games and top terminals.

All three use custom tooltips and consistent theme colors.

Recent Events Table

Displays 10 latest game events with details such as Event ID, Game, Terminal, Player, Bet, Win, and Timestamp.

The theme of the Dashboard was selected using a Canva color palette.

SECURITY AND ACCESS

MongoDB Atlas network access is set to 0.0.0.0/0 (allow from anywhere).

CORS is enabled on the backend to allow communication with the frontend.

Seed data is randomized on each run.

All mock data follows the defined GameEvent schema.

AUTHOR INFORMATION

Developed by: Harsh Gupta
Role: Full-Stack Engineer
