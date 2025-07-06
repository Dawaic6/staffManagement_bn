import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role: "user" | "admin";
  department: "SDHR" | "BRA";
  title?: string;
  status?: "Researcher" | "Employee"; // Enum for status
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    department: { type: String, enum: ["SDHR", "BRA"], required: true },
    title: { type: String },
    status: { type: String, enum: ["Researcher", "Employee"] }, // Enum for status
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);