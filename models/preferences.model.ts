import { IHobbies } from "./../interfaces/hobbies.interface";
import mongoose, { Schema } from "mongoose";
import { IAgeRange, IPreferences } from "../interfaces/preferences.interface";
import { IGenderType } from "../interfaces/profile.interface";

const ageSchema = new Schema<IAgeRange>({
  minAge: {
    type: Number,
  },
  maxAge: {
    type: Number,
  },
});

const preferencesSchema = new Schema<IPreferences>({
  gender: {
    type: String,
    enum: Object.values(IGenderType),
  },
  age: {
    type: ageSchema,
  },
  distance: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
const Preferences = mongoose.model<IPreferences>(
  "Preferences",
  preferencesSchema
);
export default Preferences;
