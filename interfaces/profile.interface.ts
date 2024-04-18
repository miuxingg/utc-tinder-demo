import mongoose from "mongoose";

export interface IProfile {
  user?: mongoose.Types.ObjectId;
  hobby?: [mongoose.Types.ObjectId];
  preferences?: mongoose.Types.ObjectId;
  activity?: [mongoose.Types.ObjectId];
  title?: string;
  description?: string;
  photos?: IPhoto[];
  age?: number;
  gender?: IGenderType;
  adress?: string;
  location?: ILocation;
}

export interface IPhoto {
  avatarUrl?: string;
  imageProfileUrl: string[];
}

export enum IGenderType {
  male = "Male",
  female = "Female",
  other = "Other",
}

export interface ILocation {
  type: string;
  coordinates: [number];
}
