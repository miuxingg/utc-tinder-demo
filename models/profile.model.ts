import { Dayjs } from "dayjs";
import {
  IGenderType,
  IPhoto,
  IProfile,
} from "./../interfaces/profile.interface";
import mongoose, { Schema } from "mongoose";

const photoSchema = new Schema<IPhoto>({
  // avatarUrl: {
  //   type: String,
  //   trim: true,
  // },
  imageProfileUrl: {
    type: [String],
  },
});

const profileSchema = new Schema<IProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  hobby: [
    {
      type: Schema.Types.ObjectId,
      ref: "Hobbies",
    },
  ],
  preferences: {
    type: Schema.Types.ObjectId,
    ref: "Preferences",
  },
  activity: [
    {
      type: Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  photos: {
    type: photoSchema,
    trim: true,
  },
  age: {
    type: Number,
    trim: true,
  },
  gender: {
    type: String,
    enum: Object.values(IGenderType),
  },
  adress: {
    type: String,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

profileSchema.index({ location: "2dsphere" });
const Profile = mongoose.model<IProfile>("Profile", profileSchema);
export default Profile;
