# 🎮 GAME TELEMETRY DASHBOARD

## 🧩 PROJECT OVERVIEW
The **Game Telemetry Dashboard** is a full-stack web application designed to **visualize real-time telemetry data** from slot and arcade games.

It enables users to monitor and analyze key performance indicators such as **total spins**, **bets**, **winnings**, **RTP (Return to Player)**, **average bet**, and **daily active users (DAU)**.  
The system also includes **hourly performance trends**, **leaderboards** for top games and terminals, and a **recent events log**.

The **backend** handles telemetry ingestion and KPI aggregation, while the **frontend** provides a clean and responsive dashboard interface for visualization.  
A **seed script** is also included to generate and upload mock data.

## 🛠️ TECHNOLOGY STACK

**Frontend:** React (Vite), TypeScript, Axios, Recharts  
**Backend:** Node.js, Express.js, TypeScript, Mongoose  
**Database:** MongoDB Atlas  
**Styling:** Custom CSS theme based on Canva color palette  
**Utilities:** tsx, dotenv, cors

## ⚙️ INSTALLATION AND SETUP

### 🧩 Clone the Repository
```bash
git clone https://github.com/harshgupt/game-telemetry-system
cd game-telemetry-system
```

### 🖥️ BACKEND SETUP
```bash
cd server
npm install
copy .env.example .env
```

Then create the build and start the server:
```bash
npm run build
npm start
```

Expected console output:
```bash
Connected to MongoDB
Server running on port 5000
```

### 💻 FRONTEND SETUP
```bash
cd ../web
npm install
copy .env.example .env
npm run dev
```

The frontend will start at:
http://localhost:5173 (If the port is being used, a new one will be generated)

## 🌱 SEEDING MOCK DATA
To populate the MongoDB Atlas database with sample telemetry data, run:
```bash
cd ../server
npm install --save-dev ts-node typescript
npx tsc
node dist/seed.js
```

This command uses the tsx runtime to execute src/seed.ts and insert randomized GameEvent 400 entries into the database.
Each event contains realistic but random combinations of bets, wins, timestamps, and game/terminal identifiers. It also clears the data already present in the database.

## 🔗 API ENDPOINTS

**Base URL (local):** `http://localhost:5000`

### `/events` (POST)
Inserts a new JSON (body) into the database, one at a time or in bulk. It is idempotent, so duplicate events are ignored (based on eventId).

### `/events` (GET)
Fetch all game events. Supports optional filters for `time`, `gameId`, and `terminalId`.

### `/events/recent` (GET)
Fetch the 10 most recent game events.

### `/kpis` (GET)
Retrieve calculated KPIs including:
- Total Spins  
- Total Bet  
- Total Winnings  
- RTP  
- Average Bet  
- DAU  
- Top Performers  

### `/kpis/hourly` (GET)
Retrieve hourly trends for spins, total bet, and total winnings (last 24 hours).

**Example Query Parameters:**
```bash
?gameId=game_01&terminalId=terminal_05&startTime=2025-10-01&endTime=2025-10-31
```

## 📦 DATA MODEL

The system stores all telemetry data in a single collection named **`gameevents`**.  
Each document represents one gameplay event with the following structure:

| Field | Type | Description |
|--------|------|-------------|
| `eventId` | String | Unique identifier for each event. |
| `ts` | Date | Timestamp of when the event occurred. |
| `type` | String | Type of the event (e.g., `"spin"`, `"bonus"`, `"jackpot"`). |
| `gameId` | String | Identifier for the game that generated the event. |
| `terminalId` | String | Identifier for the terminal or device where the event occurred. |
| `playerId` | String | Unique identifier for the player. |
| `currency` | String | Currency used for the event, usually `"USD"`. |
| `denomination` | Number | Coin or credit denomination value. |
| `bet` | Number | The bet amount for this event. |
| `win` | Number | The win amount for this event (0 if no win). |

### 🧾 Example Document
```bash
{
  "eventId": "evt_12345",
  "ts": "2025-11-05T10:32:14.000Z",
  "type": "spin",
  "gameId": "game_03",
  "terminalId": "terminal_07",
  "playerId": "player_21",
  "currency": "USD",
  "denomination": 1,
  "bet": 5.0,
  "win": 12.5
}
```

### 🔍 RELATIONSHIPS AND DERIVED DATA

Each **`gameId`** and **`terminalId`** is used to **group and aggregate KPIs**.

The backend calculates:

- **totalSpins** → count of spin-type events  
- **totalBet** → sum of all bet amounts  
- **totalWin** → sum of all win amounts  
- **RTP (%)** → `(totalWin / totalBet) × 100`  
- **averageBet** → `(totalBet / totalSpins)`  
- **DAU** → distinct player count per day  

The **Top Games** and **Top Terminals** tables are derived by aggregating **total bet amounts** per `gameId` and `terminalId`.


## 📊 DASHBOARD FEATURES

### 🎯 Filter Bar
- Filters data by **Game ID**, **Terminal ID**, and **custom date range**  
- Includes a **Reset** button to clear all filters

### 📈 KPI Board
Displays key metrics:
- Total Spins  
- Total Bet (USD)  
- Total Winnings (USD)  
- RTP (%)  
- Average Bet  
- Daily Active Users (DAU)  

Also includes **Top Games** and **Top Terminals** tables, ranked by total bet.

### 📉 Chart Board
- **Line Chart** for hourly trends (Spins, Bet, Winnings)  
- **Two Bar Charts** for Top Games and Top Terminals  
- All charts use **custom tooltips** and consistent **theme colors**

### 🧾 Recent Events Table
Displays the **10 latest game events** with details:
- Event ID  
- Game  
- Terminal  
- Player  
- Bet  
- Win  
- Timestamp  

The theme of the dashboard was selected using a **Canva color palette**, ensuring a cohesive and visually appealing design.

## 🎨 DESIGN DECISIONS, ASSUMPTIONS, AND TRADE-OFFS

### 🧠 Frontend Framework: React with Vite
**Decision:** Chosen for its lightweight build process, fast HMR (Hot Module Reloading), and developer-friendly setup — ideal for dashboard-style applications.  
**Trade-off:** Limited built-in routing and state management. This was acceptable since the project required only light interactivity handled via React hooks and props.

---

### 🎨 Styling with Custom CSS
**Decision:** Created a custom CSS theme based on a Canva-designed color palette instead of using Tailwind or Material UI.  
**Rationale:** Ensured a visually consistent theme that matched the assignment’s design goals and avoided dependency bloat.  
**Trade-off:** Slightly more manual styling effort, but provided full control over aesthetics and component behavior.

---

### ⚙️ Backend Framework: Node.js + Express
**Decision:** Selected for its simplicity and flexibility in creating REST APIs for telemetry and KPI aggregation.  
**Trade-off:** Express lacks built-in type safety, mitigated through **TypeScript**, which adds compile-time type checking and reduces runtime errors.

---

### 🗄️ Database: MongoDB Atlas
**Decision:** Chosen for its scalability, native JSON document structure, and seamless integration with Node.js.  
**Assumption:** Each telemetry event can be represented as a standalone JSON document without the need for relational joins.  
**Trade-off:** Aggregations on very large datasets may be slower than SQL-based solutions, but MongoDB’s aggregation pipelines are efficient for this project’s scale.

---

### 📊 Data Aggregation and KPI Calculation
**Decision:** KPIs (total bets, wins, spins, RTP, average bet, and DAU) are computed dynamically via MongoDB aggregation queries.  
**Trade-off:** Real-time aggregation provides flexibility but can become computationally expensive on massive datasets.  
**Future Consideration:** For production use, caching or pre-aggregated collections could improve performance.

---

### 🌱 Seed Script for Mock Data
**Decision:** Implemented a `seed.ts` script to populate MongoDB with 400+ randomized events for demonstration and testing.  
**Trade-off:** Randomized data ensures coverage and variety but may not accurately represent real-world user behavior patterns.

---

### 🔄 Frontend–Backend Communication
**Decision:** Utilized **Axios** for REST-based communication between frontend and backend, keeping UI and logic layers decoupled.  
**Trade-off:** REST endpoints are simple but not ideal for high-frequency telemetry; **WebSockets** could be used in future iterations for real-time streaming.

---

### 📈 KPI Representation and Layout
**Decision:** KPIs are presented as visually distinct, responsive cards, followed by tables and charts for deeper insight.  
**Rationale:** Prioritized readability and visual hierarchy over dense or cluttered data visualization.  
**Trade-off:** Excluded advanced charting features (like drill-down analytics or transitions) to maintain clarity and performance.

---

### ⚡ Performance and Optimization
**Decision:** Used minimal dependencies, lazy data fetching via `useEffect`, and responsive Recharts containers to improve performance.  
**Trade-off:** No pagination or virtual scrolling for event tables — acceptable for current dataset size and project goals.

---

### ✅ Summary
The system emphasizes **simplicity**, **maintainability**, and **visual clarity**.  
While not designed for high-frequency real-time telemetry, it demonstrates a scalable and modular architecture that can evolve to include:
- Caching layers  
- WebSocket integration  
- Advanced charting and visualization  
- Authentication and role-based access control  

This approach ensures a strong foundation for future iterations while maintaining focus on clarity and functionality.

## 🔐 SECURITY AND ACCESS
- **MongoDB Atlas** network access is set to `0.0.0.0/0` *(allow from anywhere)*  
- **CORS** is enabled on the backend to allow communication with the frontend  
- **Seed data** is randomized on each run  
- All mock data follows the defined **GameEvent schema**

---

## 👨‍💻 AUTHOR INFORMATION
**Developed by:** Harsh Gupta  
**Role:** Full-Stack Engineer

