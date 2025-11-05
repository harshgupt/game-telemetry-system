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

export default function ChartBoard({ filters }: { filters: Filters }) {
	const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
	const [topGames, setTopGames] = useState<TopGame[]>([]);
	const [topTerminals, setTopTerminals] = useState<TopTerminal[]>([]);

	useEffect(() => {
		const params = new URLSearchParams();
		if (filters.gameId) params.append("gameId", filters.gameId);
		if (filters.terminalId) params.append("terminalId", filters.terminalId);

		// Fetch hourly trends
		api
			.get(`/kpis/hourly?${params.toString()}`)
			.then((res) => setHourlyData(res.data));

		// Fetch top games & terminals
		api.get(`/kpis?${params.toString()}`).then((res) => {
			setTopGames(res.data.topGames || []);
			setTopTerminals(res.data.topTerminals || []);
		});
	}, [filters]);

	return (
		<div className="grid grid-cols-1 gap-6 mb-6">
			{/* Hourly Trends */}
			<div className="bg-white p-4 rounded-lg shadow w-full">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Hourly Trends (Last 24 Hours)
				</h2>
				<div className="w-full" style={{ minHeight: "360px", height: "360px" }}>
					{hourlyData.length > 0 ? (
						<ResponsiveContainer width="100%" height={350}>
							<LineChart data={hourlyData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="hour" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="totalSpins"
									stroke="#3b82f6"
									strokeWidth={2}
									name="Spins"
								/>
								<Line
									type="monotone"
									dataKey="totalBet"
									stroke="#10b981"
									strokeWidth={2}
									name="Total Bet"
								/>
								<Line
									type="monotone"
									dataKey="totalWin"
									stroke="#f59e0b"
									strokeWidth={2}
									name="Total Win"
								/>
							</LineChart>
						</ResponsiveContainer>
					) : (
						<p className="text-gray-500 text-center mt-10">
							No hourly data available.
						</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top Games */}
				<div className="bg-white p-4 rounded-lg shadow w-full h-80">
					<h2 className="text-lg font-semibold mb-3 text-gray-800">
						Top Games
					</h2>
					{topGames.length > 0 ? (
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={topGames}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="_id" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="totalBet" fill="#3b82f6" name="Total Bet" />
							</BarChart>
						</ResponsiveContainer>
					) : (
						<p className="text-gray-500 text-center mt-10">
							No top games data.
						</p>
					)}
				</div>

				<div className="bg-white p-4 rounded-lg shadow w-full h-80">
					<h2 className="text-lg font-semibold mb-3 text-gray-800">
						Top Terminals
					</h2>
					{topTerminals.length > 0 ? (
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={topTerminals}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="_id" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="totalBet" fill="#10b981" name="Total Bet" />
							</BarChart>
						</ResponsiveContainer>
					) : (
						<p className="text-gray-500 text-center mt-10">
							No top terminals data.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
