import { IActivity, IActivityTypes } from "./../interfaces/activity.interface";
import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema<IActivity>(
  {
    senderUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    senderType: {
      type: String,
      enum: Object.values(IActivityTypes),
      default: IActivityTypes.unmatch,
    },
    receiverUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverType: {
      type: String,
      enum: Object.values(IActivityTypes),
      default: IActivityTypes.unmatch,
    },
  },
  { timestamps: true }
);
const Activity = mongoose.model<IActivity>("Activity", activitySchema);
export default Activity;
