import mongoose from 'mongoose';
import { User } from './user.model';
export let userSchema = new mongoose.Schema<User>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
