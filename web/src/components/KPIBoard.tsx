import { useEffect, useState } from "react";
import api from "../api";
import KPICard from "./KPICard";

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

	if (!data) return <p>Loading KPIs...</p>;

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<KPICard title="Total Spins" value={data.spins} colorClass="blue" />
				<KPICard
					title="Total Bet"
					value={data.totalBet.toFixed(2)}
					colorClass="green"
				/>
				<KPICard
					title="Total Win"
					value={data.totalWin.toFixed(2)}
					colorClass="yellow"
				/>
				<KPICard
					title="RTP (%)"
					value={data.rtp.toFixed(2)}
					colorClass="purple"
				/>
			</div>

			<div className="bg-white p-4 rounded-lg shadow">
				<h2 className="text-lg font-semibold mb-4">Top Games (by Total Bet)</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
						<thead className="bg-gray-100 text-gray-700 uppercase">
							<tr>
								<th className="px-4 py-2">Game ID</th>
								<th className="px-4 py-2">Total Bet</th>
								<th className="px-4 py-2">Total Win</th>
								<th className="px-4 py-2">Spins</th>
							</tr>
						</thead>
						<tbody>
							{data.topGames.map((g) => (
								<tr
									key={g._id}
									className="border-t hover:bg-gray-50 transition-colors">
									<td className="px-4 py-2">{g._id}</td>
									<td className="px-4 py-2">{g.totalBet}</td>
									<td className="px-4 py-2">{g.totalWin}</td>
									<td className="px-4 py-2">{g.spins}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div className="bg-white p-4 rounded-lg shadow">
				<h2 className="text-lg font-semibold mb-4">
					Top Terminals (by Total Bet)
				</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
						<thead className="bg-gray-100 text-gray-700 uppercase">
							<tr>
								<th className="px-4 py-2">Terminal ID</th>
								<th className="px-4 py-2">Total Bet</th>
								<th className="px-4 py-2">Total Win</th>
							</tr>
						</thead>
						<tbody>
							{data.topTerminals.map((t) => (
								<tr
									key={t._id}
									className="border-t hover:bg-gray-50 transition-colors">
									<td className="px-4 py-2">{t._id}</td>
									<td className="px-4 py-2">{t.totalBet}</td>
									<td className="px-4 py-2">{t.totalWin}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
