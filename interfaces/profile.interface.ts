import mongoose from "mongoose";
import { Dayjs } from 'dayjs'

export interface IProfile{
    user?: mongoose.Types.ObjectId,
    hobby?: mongoose.Types.ObjectId,
    title?: string,
    description?: string,
    photos?: IPhoto[],
    birthDay?: Dayjs,
    sex?: ISexType,
    adress?: string,
}

export interface IPhoto{
    avatarUrl: string,
    imageProfileUrl: string[]
}

export enum ISexType {
    male = "Male",
    female = "Female",
    other = "Other",
}
