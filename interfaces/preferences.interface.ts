import mongoose from "mongoose";
import { IGenderType } from "./profile.interface";
import { IHobbies } from "./hobbies.interface";

export interface IPreferences{
    gender: IGenderType,
    age: IAgeRange,
    distance: number,
    hobbies: IHobbies,
    otherUser: mongoose.Types.ObjectId,
    user: mongoose.Types.ObjectId,
}

export interface IAgeRange{
    minAge: number,
    maxAge: number,
}