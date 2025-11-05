type KPICardProps = {
	title: string;
	value: string | number;
	colorClass?: "spins" | "bet" | "win" | "rtp";
};

// Defines the formatting of each KPI card
export default function KPICard({
	title,
	value,
	colorClass = "spins",
}: KPICardProps) {
	const accentColors: Record<string, string> = {
		spins: "var(--color-accent-dark)",
		bet: "var(--color-accent-light)",
		win: "var(--color-accent-dark)",
		rtp: "var(--color-accent-light)",
	};

	const borderColor = accentColors[colorClass] || "var(--color-accent-dark)";

	return (
		<div
			style={{
				flex: "1 1 220px",
				maxWidth: "260px",
				minWidth: "200px",
				backgroundColor: "#fff",
				borderTop: `5px solid ${borderColor}`,
				borderRadius: "12px",
				padding: "1.25rem",
				boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
				transition: "all 0.25s ease",
				textAlign: "center",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = "translateY(-4px)";
				e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = "translateY(0)";
				e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
			}}>
			<h3
				style={{
					fontSize: "0.9rem",
					color: "var(--color-secondary)",
					fontWeight: 600,
					textTransform: "uppercase",
					marginBottom: "0.5rem",
					letterSpacing: "0.5px",
				}}>
				{title}
			</h3>
			<p
				style={{
					fontSize: "2rem",
					fontWeight: 800,
					color: "var(--color-accent-dark)",
					margin: 0,
				}}>
				{value}
			</p>
		</div>
	);
}
