import mongoose from "mongoose";
export interface IMessage {
  sender?: mongoose.Types.ObjectId;
  recipient?: mongoose.Types.ObjectId;
  content?: string;
}
