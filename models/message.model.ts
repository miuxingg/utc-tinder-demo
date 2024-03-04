import { IMessage } from '../interfaces/message.interface';
import mongoose, { Schema } from "mongoose"

const messageSchema = new Schema<IMessage>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
    },
}, {timestamps: true})
const Message = mongoose.model<IMessage>('Message', messageSchema)
export default Message
