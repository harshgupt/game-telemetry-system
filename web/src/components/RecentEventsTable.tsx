import { useEffect, useState } from "react";
import api from "../api";

// Each interface defines a strongly typed format for each specific data field
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

// RecentEventsTable displays the 10 most recent events in the database in a table
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
		return (
			<p
				style={{
					textAlign: "center",
					color: "var(--color-secondary)",
					fontStyle: "italic",
					marginTop: "1rem",
				}}>
				No recent events found.
			</p>
		);

	return (
		<div
			style={{
				backgroundColor: "white",
				padding: "1.5rem",
				borderRadius: "12px",
				boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
				width: "100%",
			}}>
			<h2
				style={{
					fontSize: "1.25rem",
					fontWeight: 700,
					color: "var(--color-accent-dark)",
					marginBottom: "1rem",
					textAlign: "center",
				}}>
				Recent Game Events
			</h2>
			<div style={{ overflowX: "auto" }}>
				<table
					style={{
						width: "100%",
						borderCollapse: "collapse",
						border: "1px solid rgba(0,0,0,0.05)",
						borderRadius: "10px",
						overflow: "hidden",
					}}>
					<thead
						style={{
							backgroundColor: "var(--color-accent-light)",
							color: "white",
							textTransform: "uppercase",
							fontSize: "0.85rem",
							letterSpacing: "0.5px",
						}}>
						<tr>
							<th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
								Event ID
							</th>
							<th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
								Type
							</th>
							<th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
								Game
							</th>
							<th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
								Terminal
							</th>
							<th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
								Player
							</th>
							<th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
								Bet ($)
							</th>
							<th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
								Winnings ($)
							</th>
							<th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
								Time
							</th>
						</tr>
					</thead>
					<tbody>
						{events.map((e, i) => (
							<tr
								key={e.eventId}
								style={{
									backgroundColor: i % 2 === 0 ? "#fafafa" : "white",
									transition: "background 0.2s ease",
								}}
								onMouseEnter={(el) =>
									(el.currentTarget.style.backgroundColor =
										"rgba(128,173,155,0.15)")
								}
								onMouseLeave={(el) =>
									(el.currentTarget.style.backgroundColor =
										i % 2 === 0 ? "#fafafa" : "white")
								}>
								<td style={{ padding: "0.75rem 1rem" }}>{e.eventId}</td>
								<td style={{ padding: "0.75rem 1rem" }}>{e.type}</td>
								<td style={{ padding: "0.75rem 1rem" }}>{e.gameId}</td>
								<td style={{ padding: "0.75rem 1rem" }}>{e.terminalId}</td>
								<td style={{ padding: "0.75rem 1rem" }}>{e.playerId}</td>
								<td
									style={{
										padding: "0.75rem 1rem",
										textAlign: "center",
										fontWeight: 500,
									}}>
									${e.bet}
								</td>
								<td
									style={{
										padding: "0.75rem 1rem",
										textAlign: "center",
										fontWeight: 500,
									}}>
									${e.win}
								</td>
								<td
									style={{
										padding: "0.75rem 1rem",
										textAlign: "center",
										color: "var(--color-secondary)",
									}}>
									{new Date(e.ts).toLocaleString("en-US", {
										day: "2-digit",
										month: "short",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
