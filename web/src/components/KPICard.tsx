type KPICardProps = {
	title: string;
	value: string | number;
	colorClass?: string;
};

export default function KPICard({
	title,
	value,
	colorClass = "border-blue-500",
}: KPICardProps) {
	return (
		<div
			className={`p-4 bg-white rounded-2xl shadow-md border-t-4 ${colorClass}`}>
			<h3 className="text-gray-500 text-sm font-medium">{title}</h3>
			<p className="text-2xl font-bold text-gray-800">{value}</p>
		</div>
	);
}
