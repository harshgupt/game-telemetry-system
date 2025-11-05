import { useEffect, useState } from "react";
import api from "../api";

interface GameEvent {
	eventId: string;
	ts: string;
	gameId: string;
	terminalId: string;
	playerId: string;
	bet: number;
	win: number;
}

export default function RecentEventsTable() {
	const [events, setEvents] = useState<GameEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRecentEvents = async () => {
			try {
				const res = await api.get<GameEvent[]>("/events/recent");
				setEvents(res.data);
			} catch (err) {
				console.error("Error fetching recent events:", err);
				setError("Failed to load events");
			} finally {
				setLoading(false);
			}
		};

		fetchRecentEvents();
	}, []);

	if (loading) return <p className="text-gray-500">Loading recent events...</p>;
	if (error) return <p className="text-red-500">{error}</p>;
	if (events.length === 0) return <p>No recent events available.</p>;

	return (
		<div className="bg-white rounded-2xl shadow-md p-6">
			<h2 className="text-xl font-semibold text-gray-800 mb-4">
				Recent Game Events
			</h2>

			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-200">
					<thead className="bg-gray-100">
						<tr>
							<th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
								Timestamp
							</th>
							<th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
								Game
							</th>
							<th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
								Terminal
							</th>
							<th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
								Player
							</th>
							<th className="py-2 px-4 text-right text-sm font-semibold text-gray-600">
								Bet
							</th>
							<th className="py-2 px-4 text-right text-sm font-semibold text-gray-600">
								Win
							</th>
						</tr>
					</thead>
					<tbody>
						{events.map((event) => (
							<tr
								key={event.eventId}
								className="border-t hover:bg-gray-50 transition">
								<td className="py-2 px-4 text-sm text-gray-700">
									{new Date(event.ts).toLocaleString()}
								</td>
								<td className="py-2 px-4 text-sm text-gray-700">
									{event.gameId}
								</td>
								<td className="py-2 px-4 text-sm text-gray-700">
									{event.terminalId}
								</td>
								<td className="py-2 px-4 text-sm text-gray-700">
									{event.playerId}
								</td>
								<td className="py-2 px-4 text-sm text-gray-700 text-right">
									{event.bet}
								</td>
								<td className="py-2 px-4 text-sm text-gray-700 text-right">
									{event.win}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
