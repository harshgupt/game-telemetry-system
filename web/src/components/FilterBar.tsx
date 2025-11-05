interface FilterBarProps {
	filters: {
		gameId: string;
		terminalId: string;
		startTime: string;
		endTime: string;
	};
	setFilters: React.Dispatch<
		React.SetStateAction<{
			gameId: string;
			terminalId: string;
			startTime: string;
			endTime: string;
		}>
	>;
}

// Filter bar which enables filtering by Game ID, Terminal ID and a Date Range
export default function FilterBar({ filters, setFilters }: FilterBarProps) {
	return (
		<div
			style={{
				backgroundColor: "white",
				borderRadius: "12px",
				boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
				padding: "1.5rem 2rem",
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
				gap: "1.5rem",
				alignItems: "end",
				width: "100%",
				boxSizing: "border-box",
			}}>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<label
					style={{
						fontSize: "0.9rem",
						color: "var(--color-secondary)",
						marginBottom: "0.25rem",
						fontWeight: 600,
					}}>
					Game ID
				</label>
				<input
					type="text"
					value={filters.gameId}
					onChange={(e) =>
						setFilters((f) => ({ ...f, gameId: e.target.value }))
					}
					placeholder="e.g., game_01"
					style={inputStyle}
				/>
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<label
					style={{
						fontSize: "0.9rem",
						color: "var(--color-secondary)",
						marginBottom: "0.25rem",
						fontWeight: 600,
					}}>
					Terminal ID
				</label>
				<input
					type="text"
					value={filters.terminalId}
					onChange={(e) =>
						setFilters((f) => ({ ...f, terminalId: e.target.value }))
					}
					placeholder="e.g., terminal_05"
					style={inputStyle}
				/>
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<label
					style={{
						fontSize: "0.9rem",
						color: "var(--color-secondary)",
						marginBottom: "0.25rem",
						fontWeight: 600,
					}}>
					Start Time
				</label>
				<input
					type="datetime-local"
					value={filters.startTime}
					onChange={(e) =>
						setFilters((f) => ({ ...f, startTime: e.target.value }))
					}
					style={inputStyle}
				/>
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<label
					style={{
						fontSize: "0.9rem",
						color: "var(--color-secondary)",
						marginBottom: "0.25rem",
						fontWeight: 600,
					}}>
					End Time
				</label>
				<input
					type="datetime-local"
					value={filters.endTime}
					onChange={(e) =>
						setFilters((f) => ({ ...f, endTime: e.target.value }))
					}
					style={inputStyle}
				/>
			</div>

			<div style={{ display: "flex", justifyContent: "center" }}>
				<button
					onClick={() =>
						setFilters({
							gameId: "",
							terminalId: "",
							startTime: "",
							endTime: "",
						})
					}
					style={{
						padding: "0.7rem 1.25rem",
						backgroundColor: "var(--color-accent-light)",
						color: "white",
						border: "none",
						borderRadius: "8px",
						cursor: "pointer",
						fontWeight: 600,
						fontSize: "0.95rem",
						width: "100%",
						maxWidth: "160px",
						transition: "background-color 0.2s ease",
						outline: "none",
						boxShadow: "none",
					}}
					onFocus={(e) => e.currentTarget.blur()}
					onMouseEnter={(e) =>
						(e.currentTarget.style.backgroundColor = "var(--color-accent-dark)")
					}
					onMouseLeave={(e) =>
						(e.currentTarget.style.backgroundColor =
							"var(--color-accent-light)")
					}>
					Reset Filters
				</button>
			</div>
		</div>
	);
}

// Common input style for cleaner readability
const inputStyle: React.CSSProperties = {
	padding: "0.6rem 0.75rem",
	borderRadius: "8px",
	border: "1px solid #ccc",
	outline: "none",
	transition: "border-color 0.2s ease",
	boxSizing: "border-box",
	width: "100%",
};
