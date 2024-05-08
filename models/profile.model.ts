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
    default: [],
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
    default: "",
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  photos: {
    type: photoSchema,
    trim: true,
    default: { imageProfileUrl: [] },
  },
  age: {
    type: Number,
    trim: true,
    default: 18,
  },
  gender: {
    type: String,
    enum: Object.values(IGenderType),
    default: IGenderType.male,
  },
  adress: {
    type: String,
    default: "",
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

profileSchema.index({ location: "2dsphere" });
const Profile = mongoose.model<IProfile>("Profile", profileSchema);
export default Profile;
