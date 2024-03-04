import mongoose from "mongoose";
export interface ICall {
  sender?: mongoose.Types.ObjectId;
  recipient?: mongoose.Types.ObjectId;
}
