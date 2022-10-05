// A Model which stores a snapshot of a Guild at a given time, with data from that guild.

import { Schema, Document, model } from 'mongoose';

export interface ISnapshot extends Document {
	guildId: string;
	name: string;
	memberCount: {
		total: number;
		today: {
			total: number;
			lastUpdated: Date;
		},
		week: {
			total: number;
			lastUpdated: Date;
		},
		month: {
			total: number;
			lastUpdated: Date;
		},
		year: {
			total: number;
			lastUpdated: Date;
		}
	},
	createdAt: Date;
	updatedAt: Date;
};

const SnapshotSchema: Schema = new Schema({
	guildId: { type: String, required: true },
	name: { type: String, required: true },
	memberCount: {
		total: { type: Number, required: true },
		today: {
			total: { type: Number, required: true },
			lastUpdated: { type: Date, required: true }
		},
		week: {
			total: { type: Number, required: true },
			lastUpdated: { type: Date, required: true }
		},
		month: {
			total: { type: Number, required: true },
			lastUpdated: { type: Date, required: true }
		},
		year: {
			total: { type: Number, required: true },
			lastUpdated: { type: Date, required: true }
		}
	},
	createdAt: { type: Date, required: true },
	updatedAt: { type: Date, required: true }
});

export const Snapshot = model<ISnapshot>('Snapshot', SnapshotSchema);