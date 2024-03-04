import { Dayjs } from 'dayjs';
import { IPhoto, IProfile, ISexType } from './../interfaces/profile.interface';
import mongoose, { Schema } from "mongoose"

const photoSchema = new Schema<IPhoto>({
    avatarUrl: {
        type: String,
        trim: true,
    },
    imageProfileUrl: {
        type: [String],
    }
})

const profileSchema = new Schema<IProfile>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    hobby: {
        type: Schema.Types.ObjectId,
        ref: 'Hobbies'
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
    },
    photos: {
        type: photoSchema,
    },
    birthDay: {
        type: Dayjs,
    },
    sex: {
        type: String,
        enum: Object.values(ISexType)
    },
    adress: {
        type: String,
    }
})
const Profile = mongoose.model<IProfile>('Profile', profileSchema)
export default  Profile
