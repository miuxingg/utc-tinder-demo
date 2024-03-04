import { ICall } from '../interfaces/call.interface';
import mongoose, { Schema } from "mongoose"

const callScheam = new Schema<ICall>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})
const Call = mongoose.model<ICall>('Call', callScheam)
export default Call
