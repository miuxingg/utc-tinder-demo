import mongoose from "mongoose";
import { ISexType } from "./profile.interface";

export interface IPreferences{
    gender: ISexType,
    age: IAgeRange,
    distance: number,
    otherUser: mongoose.Types.ObjectId,
    user: mongoose.Types.ObjectId,
}

export interface IAgeRange{
    minAge: number,
    maxAge: number,
}