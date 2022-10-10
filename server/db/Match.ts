import { Document, model, Schema } from "mongoose"
import { Kill, Metadata, Mode, Players, Round, Teams } from "~~/types/match";

interface IMatch extends Document {
	metadata: Metadata;
	players:  Players;
	teams:    Teams;
	rounds:   Round[];
	kills:    Kill[];
}

const MatchSchema = new Schema(
	{
		metadata: {
			map: {
				type: String,
				required: true
			},
			game_length: {
				type: Number,
				required: true
							},
			rounds_played: {
				type: Number,
				required: true
			},
			game_start: {
				type: Date,
				required: true
			},
			mode: {
				type: String,
				required: true
			},
			matchid: {
				type: String,
				required: true
			}
		},
		players: {
			all_players: {
				type: [Object],
				required: true
			},
			red: {
				type: [Object],
				required: true
			},
			blue: {
				type: [Object],
				required: true
			}
		},
		teams: {
			red: {
				rounds_won: {
					type: Number,
					required: true
				},
				players: {
					type: [Object],
					required: true
				}
			},
			blue: {
				rounds_won: {
					type: Number,
					required: true
				},
				players: {
					type: [Object],
					required: true
				}
			}
		},
		rounds: {
			type: [Object],
			required: true
		},
		kills: {
			type: [Object],
			required: true
		}
	},
	{ timestamps: true }
);

export default model<IMatch>("Match", MatchSchema);