import mongoose, { Schema } from "mongoose"
import { IAgeRange, IPreferences } from "../interfaces/preferences.interface"
import { IDrinkType, IHobbies, IPetType, ISportType } from "../interfaces/hobbies.interface"

const hobbiesSchema = new Schema<IHobbies>({
    sport: {
        type: String,
        enum: Object.values(ISportType)
    },
    music: {
        type: [String],
        trim: true,
    },
    pet: {
        type: String,
        enum: Object.values(IPetType),
    },
    drink: {
        type: String,
        enum: Object.values(IDrinkType),
    },
    education: {
        type: String,
    },
    career: {
        type: String,
    }
})
const Hobbies = mongoose.model<IHobbies>('Hobbies', hobbiesSchema)
export default  Hobbies