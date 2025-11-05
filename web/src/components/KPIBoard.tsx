import { useEffect, useState } from "react";
import api from "../api";
import KPICard from "./KPICard";

interface KPIs {
	spins: number;
	totalBet: number;
	totalWin: number;
	rtp: number;
	averageBet: number;
	dau: { date: string; count: number }[];
	topGames: { _id: string; totalBet: number; totalWin: number }[];
	topTerminals: { _id: string; totalBet: number; totalWin: number }[];
}

export default function KPIBoard() {
	const [data, setData] = useState<KPIs | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchKPIs = async () => {
			try {
				const res = await api.get("/kpis");
				setData(res.data);
			} catch (err) {
				console.error("Error fetching KPIs:", err);
				setError("Failed to load KPIs");
			} finally {
				setLoading(false);
			}
		};

		fetchKPIs();
	}, []);

	if (loading) return <p className="text-gray-500">Loading KPIs...</p>;
	if (error) return <p className="text-red-500">{error}</p>;
	if (!data) return <p>No KPI data found</p>;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
			<KPICard
				title="Total Spins"
				value={data.spins}
				colorClass="border-blue-500"
			/>
			<KPICard
				title="Total Bet"
				value={data.totalBet.toFixed(2)}
				colorClass="border-green-500"
			/>
			<KPICard
				title="Total Win"
				value={data.totalWin.toFixed(2)}
				colorClass="border-yellow-500"
			/>
			<KPICard
				title="RTP (%)"
				value={data.rtp.toFixed(2)}
				colorClass="border-purple-500"
			/>
		</div>
	);
}
