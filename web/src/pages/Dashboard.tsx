import { useState } from "react";
import KPIBoard from "../components/KPIBoard";
import ChartBoard from "../components/ChartBoard";
import RecentEventsTable from "../components/RecentEventsTable";
import FilterBar from "../components/FilterBar";

export default function Dashboard() {
	const [filters, setFilters] = useState({
		gameId: "",
		terminalId: "",
		startTime: "",
		endTime: "",
	});

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">
				Game Telemetry Dashboard
			</h1>

			<FilterBar filters={filters} setFilters={setFilters} />

			<KPIBoard filters={filters} />
			<ChartBoard filters={filters} />
			<RecentEventsTable filters={filters} />
		</div>
	);
}
