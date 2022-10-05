import mongoose from 'mongoose';

export type IAccessKey = {
	key: string;
  createdBy: string;
}

const KeySchema = new mongoose.Schema<IAccessKey>(
  {
    key: { type: String, required: true, unique: true },
		createdBy: { type: String, required: true }
  },
  { timestamps: true, collation: { locale: 'en', strength: 2 } }
);

export const AccessKey = mongoose.model<IAccessKey>("AccessKey", KeySchema);