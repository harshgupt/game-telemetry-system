import { Request, Response } from "express";
import { GameEvent } from "../models/GameEvent.js";

// Create Game Event
export const createEvent = async (req: Request, res: Response) => {
	try {
		const data = req.body;
		if (Array.isArray(data)) {
			const uniqueEvents = data.filter((e) => e.eventId);
			const result = await GameEvent.insertMany(uniqueEvents, {
				ordered: false,
			});
			return res.status(201).json({
				message: "Bulk events inserted successfully",
				count: result.length,
			});
		}

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
export const getAllEvents = async (req: Request, res: Response) => {
	try {
		const { startTime, endTime, gameId, terminalId } = req.query;
		const filter: any = {};

		if (startTime || endTime) {
			filter.ts = {};
			if (startTime) filter.ts.$gte = new Date(startTime as string);
			if (endTime) filter.ts.$lte = new Date(endTime as string);
		}

		if (gameId) filter.gameId = gameId;
		if (terminalId) filter.terminalId = terminalId;

		const events = await GameEvent.find(filter).sort({ ts: -1 });
		res.status(200).json(events);
	} catch (error) {
		console.error("Error fetching game events:", error);
		res.status(500).json({ message: "Server error", error });
	}
};

// Get Recent Game Events (last 10)
export const getRecentEvents = async (req: Request, res: Response) => {
	try {
		const { gameId, terminalId } = req.query;
		const filter: any = {};

		if (gameId) filter.gameId = gameId;
		if (terminalId) filter.terminalId = terminalId;

		const recentEvents = await GameEvent.find(filter)
			.sort({ ts: -1 })
			.limit(10);

		res.status(200).json(recentEvents);
	} catch (error) {
		console.error("Error fetching recent game events:", error);
		res.status(500).json({ message: "Server error", error });
	}
};
