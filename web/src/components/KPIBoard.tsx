import { useEffect, useState } from "react";
import api from "../api";
import KPICard from "./KPICard";

// Each interface defines a strongly typed format for each specific data field
interface Filters {
	gameId: string;
	terminalId: string;
	startTime: string;
	endTime: string;
}

interface TopGame {
	_id: string;
	totalBet: number;
	totalWin: number;
	spins: number;
}

interface TopTerminal {
	_id: string;
	totalBet: number;
	totalWin: number;
}

interface KPIData {
	spins: number;
	totalBet: number;
	totalWin: number;
	rtp: number;
	averageBet: number;
	dau: { date: string; count: number }[];
	topGames: TopGame[];
	topTerminals: TopTerminal[];
}

// KPIBoard contains functionality to show the 6 different KPI Cards
// Total Spins is the number of spins done (can be filtered)
// Total Bet is the total of all the bets (can be filtered)
// Total Winnings is the total amount paid back to players (can be filtered)
// RTP is the Return to Player percentage value, calculated by total winnings / total bet (can be filtered)
// Average Bet is the average amount a player bets per spin, calculated by total bet / total spins
// Active Players is the number of unique players who played the games. This is fetched from the DAU
// KPIBoard also shows the Top Games and Top Terminals based on the total bets placed in those (can be filtered)
export default function KPIBoard({ filters }: { filters: Filters }) {
	const [data, setData] = useState<KPIData | null>(null);

	useEffect(() => {
		const params = new URLSearchParams();
		if (filters.gameId) params.append("gameId", filters.gameId);
		if (filters.terminalId) params.append("terminalId", filters.terminalId);
		if (filters.startTime) params.append("startTime", filters.startTime);
		if (filters.endTime) params.append("endTime", filters.endTime);

		api.get(`/kpis?${params.toString()}`).then((res) => setData(res.data));
	}, [filters]);

	if (!data) return <p>Retrieving KPIs...</p>;

	const latestDAU =
		data.dau && data.dau.length > 0 ? data.dau[data.dau.length - 1].count : 0;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: "1.5rem",
					justifyContent: "center",
					width: "100%",
				}}>
				<KPICard title="Total Spins" value={data.spins} colorClass="spins" />
				<KPICard
					title="Total Bet ($)"
					value={data.totalBet.toFixed(2)}
					colorClass="bet"
				/>
				<KPICard
					title="Total Winnings ($)"
					value={data.totalWin.toFixed(2)}
					colorClass="win"
				/>
				<KPICard title="RTP (%)" value={data.rtp.toFixed(2)} colorClass="rtp" />
				<KPICard
					title="Avg Bet ($)"
					value={data.averageBet.toFixed(2)}
					colorClass="win"
				/>
				<KPICard
					title="Active Players (Today)"
					value={latestDAU}
					colorClass="bet"
				/>
			</div>

			<hr
				style={{
					width: "100%",
					border: "none",
					borderTop: "1px solid rgba(166, 141, 134, 0.6)",
					margin: "1rem 0",
				}}
			/>
			<div
				style={{
					backgroundColor: "white",
					padding: "1.5rem",
					borderRadius: "12px",
					boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
				}}>
				<h2
					style={{
						fontSize: "1.25rem",
						fontWeight: 700,
						color: "var(--color-accent-dark)",
						marginBottom: "1rem",
						textAlign: "center",
					}}>
					Top Games (by Total Bet)
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
									Game ID
								</th>
								<th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
									Total Bet ($)
								</th>
								<th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
									Total Winnings ($)
								</th>
								<th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
									Spins
								</th>
							</tr>
						</thead>
						<tbody>
							{data.topGames.map((g, i) => (
								<tr
									key={g._id}
									style={{
										backgroundColor: i % 2 === 0 ? "#fafafa" : "white",
										transition: "background 0.2s ease",
									}}
									onMouseEnter={(e) =>
										(e.currentTarget.style.backgroundColor =
											"rgba(128,173,155,0.15)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.backgroundColor =
											i % 2 === 0 ? "#fafafa" : "white")
									}>
									<td style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
										{g._id}
									</td>
									<td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
										{g.totalBet}
									</td>
									<td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
										{g.totalWin}
									</td>
									<td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
										{g.spins}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<hr
				style={{
					width: "100%",
					border: "none",
					borderTop: "1px solid rgba(166, 141, 134, 0.6)",
					margin: "1rem 0",
				}}
			/>
			<div
				style={{
					backgroundColor: "white",
					padding: "1.5rem",
					borderRadius: "12px",
					boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
				}}>
				<h2
					style={{
						fontSize: "1.25rem",
						fontWeight: 700,
						color: "var(--color-accent-dark)",
						marginBottom: "1rem",
						textAlign: "center",
					}}>
					Top Terminals (by Total Bet)
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
								backgroundColor: "var(--color-accent-dark)",
								color: "white",
								textTransform: "uppercase",
								fontSize: "0.85rem",
								letterSpacing: "0.5px",
							}}>
							<tr>
								<th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
									Terminal ID
								</th>
								<th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
									Total Bet ($)
								</th>
								<th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
									Total Winnings ($)
								</th>
							</tr>
						</thead>
						<tbody>
							{data.topTerminals.map((t, i) => (
								<tr
									key={t._id}
									style={{
										backgroundColor: i % 2 === 0 ? "#fafafa" : "white",
										transition: "background 0.2s ease",
									}}
									onMouseEnter={(e) =>
										(e.currentTarget.style.backgroundColor =
											"rgba(87,102,76,0.12)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.backgroundColor =
											i % 2 === 0 ? "#fafafa" : "white")
									}>
									<td style={{ padding: "0.75rem 1rem", textAlign: "left" }}>
										{t._id}
									</td>
									<td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
										{t.totalBet}
									</td>
									<td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
										{t.totalWin}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<hr
				style={{
					width: "100%",
					border: "none",
					borderTop: "1px solid rgba(166, 141, 134, 0.6)",
					margin: "1rem 0",
				}}
			/>
		</div>
	);
}
