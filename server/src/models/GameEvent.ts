import mongoose from "mongoose";

// Schema to define an event in a Slot/Arcade game. 'eventId' is the primary key.
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

// Creating Index for the 3 fields
gameEventSchema.index({ ts: 1 });
gameEventSchema.index({ gameId: 1 });
gameEventSchema.index({ terminalId: 1 });

export const GameEvent = mongoose.model("GameEvent", gameEventSchema);
