import { Request, Response } from "express";
import { GameEvent } from "../models/GameEvent.js";

// Create Game Event
export const createEvent = async (req: Request, res: Response) => {
	try {
		const { eventId } = req.body;
		const existing = await GameEvent.findOne({ eventId });
		if (existing) {
			return res
				.status(200)
				.json({ message: "Duplicate entry ignored and not added" });
		}

		const newEvent = new GameEvent(req.body);
		await newEvent.save();

		res.status(201).json({
			message: "Game Event saved successfully",
			data: newEvent,
		});
	} catch (error) {
		console.error("Error while saving game event:", error);
		res.status(500).json({ message: "Server error", error });
	}
};

// Get All Game Events
export const getAllEvents = async (_req: Request, res: Response) => {
	try {
		const events = await GameEvent.find();
		res.status(200).json(events);
	} catch (error) {
		console.error("Error fetching game events:", error);
		res.status(500).json({ message: "Server error", error });
	}
};

// Get Recent Game Events (last 10)
export const getRecentEvents = async (_req: Request, res: Response) => {
	try {
		const recentEvents = await GameEvent.find().sort({ ts: -1 }).limit(10);
		res.status(200).json(recentEvents);
	} catch (error) {
		console.error("Error fetching recent game events:", error);
		res.status(500).json({ message: "Server error", error });
	}
};
