import mongoose, { Schema } from 'mongoose';
export let projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  targetLanguage: { type: [String], required: true },
});
