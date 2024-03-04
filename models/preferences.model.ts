import mongoose, { Schema } from "mongoose"
import { IAgeRange, IPreferences } from "../interfaces/preferences.interface"
import { ISexType } from "../interfaces/profile.interface"

const ageSchema = new Schema<IAgeRange>({
    minAge: {
        type: Number,
    },
    maxAge: {
        type: Number,
    },
})

const preferencesSchema = new Schema<IPreferences>({
    gender: {
        type: String,
        enum: Object.values(ISexType)
    },
    age: {
        type: ageSchema,
    },
    distance:{
        type: Number,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    otherUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})
const Preferences = mongoose.model<IPreferences>('Preferences', preferencesSchema)
export default  Preferences