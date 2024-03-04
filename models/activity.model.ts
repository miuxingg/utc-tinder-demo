import { IActivity, IActivityTypes } from './../interfaces/activity.interface';
import mongoose, { Schema } from "mongoose"

const activitySchema = new Schema<IActivity>({
    senderUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    senderType: {
        type: String,
        enum: Object.values(IActivityTypes)
    },
    receiverUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverType: {
        type: String,
        enum: Object.values(IActivityTypes)
    },
})
const Activity = mongoose.model<IActivity>('Activity', activitySchema)
export default  Activity