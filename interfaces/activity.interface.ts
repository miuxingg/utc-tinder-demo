import mongoose from "mongoose";

export interface IActivity{
    senderUser: mongoose.Types.ObjectId,
    senderType: IActivityTypes,
    receiverUser: mongoose.Types.ObjectId,
    receiverType: IActivityTypes,
}

export enum IActivityTypes{
    like = 'Like',
    unlike = "Unlike",
    unmatch = 'Unmatch'
}