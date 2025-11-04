import mongoose from "mongoose";

const gameEventSchema = new mongoose.Schema(
	{
		eventId: { type: String, unique: true, required: true },
		ts: { type: Date, required: true },
		type: {
			type: String,
			enum: ["spin", "session_start", "session_end", "voucher_print"],
			required: true,
		},
		gameId: String,
		terminalId: String,
		playerId: String,
		currency: String,
		denomination: Number,
		bet: Number,
		win: Number,
	},
	{ timestamps: true }
);

gameEventSchema.index({ ts: 1 });
gameEventSchema.index({ gameId: 1 });
gameEventSchema.index({ terminalId: 1 });

export const GameEvent = mongoose.model("GameEvent", gameEventSchema);
