import mongoose, { Schema, Document } from 'mongoose';

export interface IDiscordGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
  permissions_new: string;
}

export interface IUser extends Document {
  discordId: string;
	username: string;
	avatar: string;
	guilds: IDiscordGuild[];
  email: string;
  subscription: {
    active: boolean;
    plan: string;
    expiresAt: Date;
  }
}

const UserSchema: Schema = new Schema({
	discordId: { type: String, required: true },
	username: { type: String, required: true },
	avatar: { type: String, required: true },
  guilds: { type: Array, required: true },
  email: { type: String, required: true },
  subscription: {
    active: { type: Boolean, required: true, default: true },
    plan: { type: String, required: true, default: 'Free' },
    expiresAt: { type: Date, required: true, default: Date.now }
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);