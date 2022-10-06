import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  discordId: string;
	username: string;
	avatar: string;
  email: string;
  subscription: {
    active: boolean;
    plan: string;
    expiresAt: Date;
  },
  riotAccounts: {
    puuid: string;
    username: string;
    tagline: string;
  };
}

const UserSchema: Schema = new Schema({
	discordId: { type: String, required: true },
	username: { type: String, required: true },
	avatar: { type: String, required: true },
  email: { type: String, required: true },
  subscription: {
    active: { type: Boolean, required: true, default: false },
    plan: { type: String, required: true, default: 'Trial' },
    expiresAt: { type: Date, required: true, default: Date.now }
  },
  riotAccounts: {
    puuid: { type: String, required: false },
    username: { type: String, required: false },
    tagline: { type: String, required: false }
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);