import mongoose, { Schema } from 'mongoose';
export let dictionarySchema = new mongoose.Schema({
  key: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'project', required: true },
  text: { type: String, required: true },
  value: { type: [String], required: true },
});
