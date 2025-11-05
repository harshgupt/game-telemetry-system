import { useState } from "react";
import KPIBoard from "../components/KPIBoard";
import ChartBoard from "../components/ChartBoard";
import RecentEventsTable from "../components/RecentEventsTable";
import FilterBar from "../components/FilterBar";

// This is the main Dashboard webpage, which contains all other elements
export default function Dashboard() {
	const [filters, setFilters] = useState({
		gameId: "",
		terminalId: "",
		startTime: "",
		endTime: "",
	});

	return (
		<div
			style={{
				minHeight: "100vh",
				width: "100vw",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				backgroundColor: "var(--color-bg)",
				color: "var(--color-text)",
				fontFamily: "system-ui, sans-serif",
				overflowX: "hidden",
			}}>
			<header
				style={{
					width: "100vw",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					textAlign: "center",
					marginTop: "1.5rem",
					marginBottom: "2rem",
					paddingBottom: "1.5rem",
					borderBottom: "1px solid rgba(166, 141, 134, 0.6)", // the separator line
					boxSizing: "border-box",
				}}>
				<h1
					style={{
						fontSize: "3rem",
						fontWeight: 800,
						color: "var(--color-accent-dark)", // deep earthy green
						margin: 0,
						letterSpacing: "0.5px",
					}}>
					Game Telemetry Dashboard
				</h1>
				<p
					style={{
						color: "var(--color-secondary)", // warm muted brown
						fontSize: "1.1rem",
						margin: "0.25rem 0 0 0",
						fontWeight: 500,
					}}>
					Real-time analytics for Slot & Arcade Games
				</p>
			</header>

			<div style={{ marginBottom: "1.5rem", width: "90%" }}>
				<FilterBar filters={filters} setFilters={setFilters} />
			</div>

			<section style={{ marginBottom: "2rem", width: "90%" }}>
				<KPIBoard filters={filters} />
			</section>

			<section style={{ marginBottom: "2rem", width: "90%" }}>
				<ChartBoard filters={filters} />
			</section>

			<section style={{ width: "90%" }}>
				<RecentEventsTable filters={filters} />
			</section>
		</div>
	);
}
