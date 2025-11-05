import { useEffect, useState } from "react";
import api from "../api";

interface Filters {
	gameId: string;
	terminalId: string;
	startTime: string;
	endTime: string;
}

interface GameEvent {
	eventId: string;
	ts: string;
	type: string;
	gameId: string;
	terminalId: string;
	playerId: string;
	currency: string;
	denomination: number;
	bet: number;
	win: number;
}

export default function RecentEventsTable({ filters }: { filters: Filters }) {
	const [events, setEvents] = useState<GameEvent[]>([]);

	useEffect(() => {
		const params = new URLSearchParams();
		if (filters.gameId) params.append("gameId", filters.gameId);
		if (filters.terminalId) params.append("terminalId", filters.terminalId);

		api
			.get(`/events/recent?${params.toString()}`)
			.then((res) => setEvents(res.data));
	}, [filters]);

	if (!events.length)
		return <p className="text-gray-500 italic">No recent events found.</p>;

	return (
		<div className="bg-white p-4 rounded-lg shadow">
			<h2 className="text-lg font-semibold mb-4">Recent Game Events</h2>
			<div className="overflow-x-auto">
				<table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
					<thead className="bg-gray-100 text-gray-700 uppercase">
						<tr>
							<th className="px-4 py-2">Event ID</th>
							<th className="px-4 py-2">Type</th>
							<th className="px-4 py-2">Game</th>
							<th className="px-4 py-2">Terminal</th>
							<th className="px-4 py-2">Player</th>
							<th className="px-4 py-2">Bet</th>
							<th className="px-4 py-2">Win</th>
							<th className="px-4 py-2">Time</th>
						</tr>
					</thead>
					<tbody>
						{events.map((e) => (
							<tr
								key={e.eventId}
								className="border-t hover:bg-gray-50 transition-colors">
								<td className="px-4 py-2">{e.eventId}</td>
								<td className="px-4 py-2">{e.type}</td>
								<td className="px-4 py-2">{e.gameId}</td>
								<td className="px-4 py-2">{e.terminalId}</td>
								<td className="px-4 py-2">{e.playerId}</td>
								<td className="px-4 py-2">{e.bet}</td>
								<td className="px-4 py-2">{e.win}</td>
								<td className="px-4 py-2">{new Date(e.ts).toLocaleString()}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
