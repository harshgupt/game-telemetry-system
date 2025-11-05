import KPIBoard from "../components/KPIBoard";
import ChartBoard from "../components/ChartBoard";
import RecentEventsTable from "../components/RecentEventsTable";

export default function Dashboard() {
	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">
				Game Telemetry Dashboard
			</h1>
			<KPIBoard />
			<ChartBoard />
			<RecentEventsTable />
		</div>
	);
}
