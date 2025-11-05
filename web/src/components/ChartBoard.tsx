import { useEffect, useState } from "react";
import api from "../api";
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	BarChart,
	Bar,
	Legend,
} from "recharts";

type HourlyPoint = {
	hour: number;
	date: string;
	totalSpins: number;
	totalBet: number;
	totalWin: number;
};

type TopGame = {
	_id: string;
	totalBet: number;
	totalWin: number;
	spins?: number;
};

export default function ChartBoard() {
	const [hourly, setHourly] = useState<HourlyPoint[] | null>(null);
	const [topGames, setTopGames] = useState<TopGame[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function fetchData() {
			try {
				setLoading(true);

				const [hourRes, kpiRes] = await Promise.all([
					api.get<HourlyPoint[]>("/kpis/hourly"),
					api.get("/kpis"),
				]);

				if (cancelled) return;

				const hourlyData = hourRes.data.map((h) => ({
					...h,
					date:
						typeof h.date === "string"
							? h.date
							: new Date(h.date).toISOString(),
				}));

				setHourly(hourlyData);

				const topGamesData: TopGame[] = kpiRes.data.topGames || [];
				setTopGames(topGamesData);
			} catch (err) {
				console.error("Error fetching chart data: ", err);
				if (!cancelled) setError("Failed to load chart data");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		fetchData();
		return () => {
			cancelled = true;
		};
	}, []);

	if (loading)
		return (
			<div className="bg-white rounded-2xl shadow-md p-6 mb-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Charts & Trends
				</h2>
				<div className="text-gray-500">Loading charts...</div>
			</div>
		);

	if (error)
		return (
			<div className="bg-white rounded-2xl shadow-md p-6 mb-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Charts & Trends
				</h2>
				<div className="text-red-500">{error}</div>
			</div>
		);

	const lineData =
		hourly?.map((h) => ({
			label: new Date(h.date).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			spins: h.totalSpins,
			bet: Number(h.totalBet),
			win: Number(h.totalWin),
		})) || [];

	const barData =
		topGames?.map((g) => ({
			game: g._id,
			totalBet: g.totalBet,
			totalWin: g.totalWin,
			spins: g.spins ?? 0,
		})) || [];

	return (
		<div className="bg-white rounded-2xl shadow-md p-6 mb-6">
			<h2 className="text-xl font-semibold text-gray-800 mb-4">
				Charts & Trends
			</h2>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Hourly Line Chart */}
				<div className="bg-gray-50 rounded-xl p-4 border flex flex-col min-h-[300px]">
					<h3 className="text-sm font-medium text-gray-700 mb-2">
						Hourly Spins (last 24h)
					</h3>
					{lineData.length === 0 ? (
						<div className="text-gray-400">No hourly data available</div>
					) : (
						<ResponsiveContainer width="100%" height={250} minWidth={0}>
							<LineChart data={lineData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="label"
									minTickGap={20}
									tick={{ fontSize: 12 }}
								/>
								<YAxis allowDecimals={false} />
								<Tooltip />
								<Line
									type="monotone"
									dataKey="spins"
									stroke="#2563eb"
									strokeWidth={2}
									dot={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					)}
				</div>

				{/* Top Games Bar Chart */}
				<div className="bg-gray-50 rounded-xl p-4 border flex flex-col min-h-[300px]">
					<h3 className="text-sm font-medium text-gray-700 mb-2">
						Top Games (by total bet)
					</h3>
					{barData.length === 0 ? (
						<div className="text-gray-400">No top games data available</div>
					) : (
						<ResponsiveContainer width="100%" height={250} minWidth={0}>
							<BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis type="number" />
								<YAxis dataKey="game" type="category" width={120} />
								<Tooltip />
								<Legend />
								<Bar dataKey="totalBet" name="Total Bet" fill="#10b981" />
								<Bar dataKey="totalWin" name="Total Win" fill="#f59e0b" />
							</BarChart>
						</ResponsiveContainer>
					)}
				</div>
			</div>
		</div>
	);
}
