import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IGuild extends Document {
  guildId: string;
	name: string;
	roles: {
		name: string;
		permissions: string[];
	}[];
	channels: {
		id: string;
		name: string;
	}[];
	authorised: IUser['_id'][];
	active: boolean;
	modules: {
		name: string;
		enabled: boolean;
	}[];
}

const GuildSchema: Schema = new Schema({
	guildId: { type: String, required: true },
	name: { type: String, required: true },
	roles: [
		{
			name: { type: String, required: true },
			permissions: [{ type: String, required: true }],
		},
	],
	channels: [
		{
			id: { type: String, required: true },
			name: { type: String, required: true },
		},
	],
	authorised: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	active: { type: Boolean, required: true },
	modules: [
		{
			name: { type: String, required: true },
			enabled: { type: Boolean, required: true },
		},
	]
});

export const Guild = mongoose.model<IGuild>('Guild', GuildSchema);