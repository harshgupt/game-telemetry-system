import mongoose from "mongoose";
import dotenv from "dotenv";
import { GameEvent } from "./models/GameEvent.js"; // ✅ Uses your existing model

dotenv.config();

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/game_telemetry")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

const random = (min: number, max: number): number =>
	Math.random() * (max - min) + min;
const randomInt = (min: number, max: number): number =>
	Math.floor(random(min, max));

// Define 8 game IDs, 6 terminal IDs, 20 player IDs, and 3 different currencies
const GAMES = Array.from({ length: 8 }, (_, i) => `game_${i + 1}`);
const TERMINALS = Array.from({ length: 6 }, (_, i) => `terminal_${i + 1}`);
const PLAYERS = Array.from({ length: 20 }, (_, i) => `player_${i + 1}`);
const CURRENCIES = ["USD", "EUR", "INR"];

// Generates mock events to upload
const generateEvents = () => {
	const events = [];

	for (let i = 0; i < 400; i++) {
		// Random bet from $1 to $5
		const bet = randomInt(1, 5);
		// Random win amount with a 35% win chance
		const win =
			Math.random() < 0.35 ? Number((bet * random(1.2, 3.0)).toFixed(2)) : 0;
		const date = new Date();
		// Random date within the last 20 days
		date.setHours(date.getHours() - randomInt(0, 480));

		events.push({
			eventId: `evt_${i + 1}`,
			ts: date,
			type: "spin",
			gameId: GAMES[randomInt(0, GAMES.length)],
			terminalId: TERMINALS[randomInt(0, TERMINALS.length)],
			playerId: PLAYERS[randomInt(0, PLAYERS.length)],
			currency: CURRENCIES[randomInt(0, CURRENCIES.length)],
			denomination: 1,
			bet,
			win,
		});
	}

	return events;
};

async function seed() {
	try {
		console.log("Starting database seeding...");

		// Clear existing data
		await GameEvent.deleteMany({});
		console.log("Cleared old GameEvent data");

		// Insert mock data
		const mockEvents = generateEvents();
		await GameEvent.insertMany(mockEvents);
		console.log(`Inserted mock game events`);

		console.log("Seeding complete. Closing connection");
		await mongoose.connection.close();
	} catch (err) {
		console.error("Error during seeding:", err);
		await mongoose.connection.close();
	}
}

seed();
