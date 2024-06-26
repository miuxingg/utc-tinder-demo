import mongoose, { Schema } from "mongoose";
import {
  ICommunication,
  IDrink,
  IEducation,
  IHobbies,
  IPet,
  ISport,
  IThings,
  IZodiac,
} from "../interfaces/hobbies.interface";

const hobbiesSchema = new Schema<IHobbies>({
  type: String,
  name: String,

  // sport: {
  //   type: String,
  //   enum: Object.values(ISport),
  // },
  // music: {
  //   type: [String],
  //   trim: true,
  //   default: undefined,
  // },
  // pet: {
  //   type: String,
  //   enum: Object.values(IPet),
  // },
  // drink: {
  //   type: String,
  //   enum: Object.values(IDrink),
  // },
  // education: {
  //   type: String,
  //   enum: Object.values(IEducation),
  // },
  // career: {
  //   type: String,
  // },
  // zodiac: {
  //   type: String,
  //   enum: Object.values(IZodiac),
  // },
  // communication: {
  //   type: String,
  //   enum: Object.values(ICommunication),
  // },
  // things: {
  //   type: String,
  //   enum: Object.values(IThings),
  // },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // },
});
const Hobbies = mongoose.model<IHobbies>("Hobbies", hobbiesSchema);
export default Hobbies;
