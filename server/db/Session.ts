import { IUser } from './User';
import { Schema, model, Document } from 'mongoose';

export interface ISession extends Document {
	user: IUser['_id'];
	isOnline: boolean;
	accessToken: string;
	sessionId: string;
	createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
	{
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		isOnline: { type: Boolean, required: true },
		accessToken: { type: String, required: true },
		sessionId: { type: String, required: false },
		createdAt: { type: Date, required: true, default: Date.now, expires: 604800 },
	},
	{ timestamps: true, collation: { locale: 'en', strength: 2 } }
);

export const Session = model<ISession>('Session', SessionSchema);