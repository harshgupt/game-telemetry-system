import { Request, Response } from "express";
import { GameEvent } from "../models/GameEvent.js";

export const getKPIs = async (req: Request, res: Response) => {
	try {
		const { gameId, terminalId, startTime, endTime } = req.query;
		const filter: any = {};

		if (gameId) filter.gameId = gameId;
		if (terminalId) filter.terminalId = terminalId;

		if (startTime || endTime) {
			filter.ts = {};
			if (startTime) filter.ts.$gte = new Date(startTime as string);
			if (endTime) filter.ts.$lte = new Date(endTime as string);
		}

		// Total spins
		const spins = await GameEvent.countDocuments({ type: "spin", ...filter });

		// Aggregate total bets and total wins
		const totals = await GameEvent.aggregate([
			{ $match: filter },
			{
				$group: {
					_id: null,
					totalBet: { $sum: "$bet" },
					totalWin: { $sum: "$win" },
				},
			},
		]);

		const totalBet = totals[0]?.totalBet || 0;
		const totalWin = totals[0]?.totalWin || 0;

		// Calculate Return to Player (in Percentage %)
		const rtp = totalBet > 0 ? (totalWin / totalBet) * 100 : 0;

		// Calculate Average Bet
		const averageBet = spins > 0 ? totalBet / spins : 0;

		// Calculate Daily Active Users (for the last 30 days)
		const now = new Date();
		const startDate = new Date(now);
		startDate.setDate(now.getDate() - 30);

		const dauPipeline = [
			{
				$match: { ...filter, type: "spin", ts: { $gte: startDate } },
			},
			{
				$group: {
					_id: {
						year: { $year: "$ts" },
						month: { $month: "$ts" },
						day: { $dayOfMonth: "$ts" },
					},
					uniquePlayers: { $addToSet: "$playerId" },
				},
			},
			{
				$project: {
					_id: 0,
					date: {
						$dateToString: {
							format: "%Y-%m-%d",
							date: {
								$dateFromParts: {
									year: "$_id.year",
									month: "$_id.month",
									day: "$_id.day",
								},
							},
						},
					},
					count: { $size: "$uniquePlayers" },
				},
			},
			{ $sort: { date: 1 } },
		];

		const dauTrendRaw = await GameEvent.aggregate(dauPipeline as any);
		const dauMap: Record<string, number> = {};
		for (const entry of dauTrendRaw) {
			dauMap[entry.date] = entry.count;
		}

		const dauTrend = [];
		for (let i = 29; i >= 0; i--) {
			const d = new Date(now);
			d.setDate(now.getDate() - i);
			const key = d.toISOString().slice(0, 10);
			dauTrend.push({
				date: key,
				count: dauMap[key] || 0,
			});
		}

		// Top Games (using total bet)
		const topGames = await GameEvent.aggregate([
			{ $match: filter },
			{
				$group: {
					_id: "$gameId",
					totalBet: { $sum: "$bet" },
					totalWin: { $sum: "$win" },
					spins: { $sum: { $cond: [{ $eq: ["$type", "spin"] }, 1, 0] } },
				},
			},
			{ $sort: { totalBet: -1 } },
			{ $limit: 5 },
		]);

		// Top Terminals (using total bet)
		const topTerminals = await GameEvent.aggregate([
			{ $match: filter },
			{
				$group: {
					_id: "$terminalId",
					totalBet: { $sum: "$bet" },
					totalWin: { $sum: "$win" },
				},
			},
			{ $sort: { totalBet: -1 } },
			{ $limit: 5 },
		]);

		res.json({
			spins,
			totalBet,
			totalWin,
			rtp: Number(rtp.toFixed(2)),
			averageBet: Number(averageBet.toFixed(2)),
			dau: dauTrend,
			topGames,
			topTerminals,
		});
	} catch (error) {
		console.error("Error fetching KPIs:", error);
		res.status(500).json({ message: "Server error", error });
	}
};

// Get Hourly Trends (last 24 hours)
export const getHourlyTrends = async (req: Request, res: Response) => {
	try {
		const { gameId, terminalId } = req.query;
		const filter: any = {};

		if (gameId) filter.gameId = gameId;
		if (terminalId) filter.terminalId = terminalId;

		const now = new Date();
		const yesterday = new Date(now);
		yesterday.setHours(now.getHours() - 24);

		const trends = await GameEvent.aggregate([
			{
				$match: {
					...filter,
					ts: { $gte: yesterday, $lte: now },
				},
			},
			{
				$group: {
					_id: {
						year: { $year: "$ts" },
						month: { $month: "$ts" },
						day: { $dayOfMonth: "$ts" },
						hour: { $hour: "$ts" },
					},
					totalSpins: { $sum: { $cond: [{ $eq: ["$type", "spin"] }, 1, 0] } },
					totalBet: { $sum: "$bet" },
					totalWin: { $sum: "$win" },
				},
			},
			{ $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } },
		]);

		const hourlyData: Record<string, any> = {};
		for (const t of trends) {
			const date = new Date(t._id.year, t._id.month - 1, t._id.day, t._id.hour);
			const hourKey = date.toISOString().slice(0, 13);
			hourlyData[hourKey] = {
				hour: date.getHours(),
				date: date,
				totalSpins: t.totalSpins,
				totalBet: t.totalBet,
				totalWin: t.totalWin,
			};
		}

		const result = [];
		for (let i = 23; i >= 0; i--) {
			const d = new Date(now);
			d.setHours(now.getHours() - i, 0, 0, 0);
			const hourKey = d.toISOString().slice(0, 13);

			result.push(
				hourlyData[hourKey] || {
					hour: d.getHours(),
					date: d,
					totalSpins: 0,
					totalBet: 0,
					totalWin: 0,
				}
			);
		}

		res.status(200).json(result);
	} catch (error) {
		console.error("Error generating hourly trends:", error);
		res.status(500).json({ message: "Server error", error });
	}
};
