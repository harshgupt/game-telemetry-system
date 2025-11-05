import { useEffect, useState } from "react";
import api from "../api";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
	CartesianGrid,
	BarChart,
	Bar,
} from "recharts";

// Each interface defines a strongly typed format for each specific data field
interface Filters {
	gameId: string;
	terminalId: string;
	startTime: string;
	endTime: string;
}

interface HourlyData {
	hour: number;
	date: string;
	totalSpins: number;
	totalBet: number;
	totalWin: number;
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

interface CustomTooltipProps {
	active?: boolean;
	payload?: {
		name?: string;
		value?: number | string;
	}[];
	label?: string | number;
}

// ChartBoard contains functionality to show the 3 different charts
// Line Chart for the Hourly Trends
// Bar Chart for Top Games and Top Terminals
// It also applies the predefined filters
export default function ChartBoard({ filters }: { filters: Filters }) {
	const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
	const [topGames, setTopGames] = useState<TopGame[]>([]);
	const [topTerminals, setTopTerminals] = useState<TopTerminal[]>([]);

	useEffect(() => {
		const params = new URLSearchParams();
		if (filters.gameId) params.append("gameId", filters.gameId);
		if (filters.terminalId) params.append("terminalId", filters.terminalId);

		// API calls
		api
			.get(`/kpis/hourly?${params.toString()}`)
			.then((res) => setHourlyData(res.data));

		api.get(`/kpis?${params.toString()}`).then((res) => {
			setTopGames(res.data.topGames || []);
			setTopTerminals(res.data.topTerminals || []);
		});
	}, [filters]);

	// Custom Tooltip which allows for change of theme and adding custom fields in the default tooltip provided by Recharts
	const CustomTooltip: React.FC<CustomTooltipProps> = ({
		active,
		payload,
		label,
	}) => {
		if (!active || !payload?.length) return null;

		return (
			<div
				style={{
					backgroundColor: "var(--color-bg)",
					border: "1px solid rgba(0,0,0,0.1)",
					borderRadius: "8px",
					padding: "0.75rem 1rem",
					boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
				}}>
				<p
					style={{
						margin: 0,
						fontWeight: 600,
						color: "var(--color-accent-dark)",
					}}>
					Hour: {label}
				</p>
				{payload.map((entry, index) => {
					const name = entry.name ?? "";
					const value = entry.value ?? 0;
					const displayValue =
						name === "Total Bet" || name === "Total Winnings"
							? `$${value}`
							: value;

					return (
						<p
							key={`item-${index}`}
							style={{
								margin: "4px 0",
								color: "var(--color-text)",
								fontSize: "0.9rem",
							}}>
							{name}: {displayValue}
						</p>
					);
				})}
			</div>
		);
	};

	// The Hourly Trends Line Graph, and Top Games and Top Terminals Bar Graphs
	return (
		<div className="grid grid-cols-1 gap-6 mb-6">
			<div
				className="bg-white rounded-lg shadow w-full"
				style={{
					padding: "1.5rem",
					borderRadius: "12px",
					boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
				}}>
				<h2
					className="text-xl font-semibold mb-4"
					style={{
						color: "var(--color-accent-dark)",
						textAlign: "center",
						marginBottom: "1rem",
					}}>
					Hourly Trends (Last 24 Hours)
				</h2>

				<div
					className="w-full"
					style={{
						minHeight: "360px",
						height: "360px",
					}}>
					{hourlyData.length > 0 ? (
						<ResponsiveContainer width="100%" height={350}>
							<LineChart
								data={hourlyData}
								margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
								<CartesianGrid
									stroke="rgba(0,0,0,0.05)"
									strokeDasharray="3 3"
								/>
								<XAxis
									dataKey="hour"
									label={{
										value: "Hour",
										position: "insideBottom",
										offset: -5,
										fill: "var(--color-secondary)",
									}}
								/>
								<YAxis
									label={{
										value: "Value",
										angle: -90,
										position: "insideLeft",
										fill: "var(--color-secondary)",
									}}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Legend
									verticalAlign="top"
									height={36}
									wrapperStyle={{
										color: "var(--color-text)",
										paddingBottom: "1rem",
									}}
								/>
								<Line
									type="monotone"
									dataKey="totalSpins"
									stroke="var(--color-accent-dark)"
									strokeWidth={2}
									name="Spins"
									dot={false}
								/>
								<Line
									type="monotone"
									dataKey="totalBet"
									stroke="var(--color-accent-light)"
									strokeWidth={2}
									name="Total Bet"
									dot={false}
								/>
								<Line
									type="monotone"
									dataKey="totalWin"
									stroke="var(--color-secondary)"
									strokeWidth={2}
									name="Total Winnings"
									dot={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					) : (
						<p
							className="text-gray-500 text-center mt-10"
							style={{ color: "var(--color-secondary)" }}>
							No hourly data available.
						</p>
					)}
				</div>
			</div>

			<hr
				style={{
					width: "100%",
					border: "none",
					borderTop: "1px solid rgba(166, 141, 134, 0.6)",
					margin: "2rem 0",
				}}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div
					className="bg-white p-4 rounded-lg shadow w-full h-80"
					style={{
						borderRadius: "12px",
						boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
					}}>
					<h2
						className="text-lg font-semibold mb-3"
						style={{
							color: "var(--color-accent-dark)",
							textAlign: "center",
						}}>
						Top Games (by Total Bet)
					</h2>
					{topGames.length > 0 ? (
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={topGames}>
								<CartesianGrid
									stroke="rgba(0,0,0,0.05)"
									strokeDasharray="3 3"
								/>
								<XAxis
									dataKey="_id"
									tick={{ fill: "var(--color-text)" }}
									stroke="var(--color-secondary)"
								/>
								<YAxis
									tick={{ fill: "var(--color-text)" }}
									stroke="var(--color-secondary)"
								/>
								<Tooltip content={<CustomTooltip />} cursor={false} />
								<Bar
									dataKey="totalBet"
									fill="var(--color-accent-light)"
									name="Total Bet"
									radius={[6, 6, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					) : (
						<p
							className="text-gray-500 text-center mt-10"
							style={{ color: "var(--color-secondary)" }}>
							No top games data.
						</p>
					)}
				</div>

				<div
					className="bg-white p-4 rounded-lg shadow w-full h-80"
					style={{
						borderRadius: "12px",
						boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
					}}>
					<h2
						className="text-lg font-semibold mb-3"
						style={{
							color: "var(--color-accent-dark)",
							textAlign: "center",
						}}>
						Top Terminals (by Total Bet)
					</h2>
					{topTerminals.length > 0 ? (
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={topTerminals}>
								<CartesianGrid
									stroke="rgba(0,0,0,0.05)"
									strokeDasharray="3 3"
								/>
								<XAxis
									dataKey="_id"
									tick={{ fill: "var(--color-text)" }}
									stroke="var(--color-secondary)"
								/>
								<YAxis
									tick={{ fill: "var(--color-text)" }}
									stroke="var(--color-secondary)"
								/>
								<Tooltip content={<CustomTooltip />} cursor={false} />
								<Bar
									dataKey="totalBet"
									fill="var(--color-accent-dark)"
									name="Total Bet"
									radius={[6, 6, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					) : (
						<p
							className="text-gray-500 text-center mt-10"
							style={{ color: "var(--color-secondary)" }}>
							No top terminals data.
						</p>
					)}
				</div>
			</div>

			<hr
				style={{
					width: "100%",
					border: "none",
					borderTop: "1px solid rgba(166, 141, 134, 0.6)",
					margin: "2rem 0",
				}}
			/>
		</div>
	);
}
