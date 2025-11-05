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

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
	return (
		<div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Game ID
				</label>
				<input
					type="text"
					value={filters.gameId}
					onChange={(e) =>
						setFilters((f) => ({ ...f, gameId: e.target.value }))
					}
					className="mt-1 p-2 border rounded w-40"
					placeholder="game_01"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700">
					Terminal ID
				</label>
				<input
					type="text"
					value={filters.terminalId}
					onChange={(e) =>
						setFilters((f) => ({ ...f, terminalId: e.target.value }))
					}
					className="mt-1 p-2 border rounded w-40"
					placeholder="terminal_01"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700">
					Start Time
				</label>
				<input
					type="datetime-local"
					value={filters.startTime}
					onChange={(e) =>
						setFilters((f) => ({ ...f, startTime: e.target.value }))
					}
					className="mt-1 p-2 border rounded w-56"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700">
					End Time
				</label>
				<input
					type="datetime-local"
					value={filters.endTime}
					onChange={(e) =>
						setFilters((f) => ({ ...f, endTime: e.target.value }))
					}
					className="mt-1 p-2 border rounded w-56"
				/>
			</div>
		</div>
	);
}
