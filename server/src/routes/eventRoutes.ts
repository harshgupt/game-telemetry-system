import express from "express";
import {
	createEvent,
	getAllEvents,
	getRecentEvents,
} from "../controllers/eventController.js";

const router = express.Router();

// POST ".../api/events"
router.post("/", createEvent);

// GET ".../api/events"
router.get("/", getAllEvents);

// GET ".../api/events/recent"
router.get("/recent", getRecentEvents);

export default router;
