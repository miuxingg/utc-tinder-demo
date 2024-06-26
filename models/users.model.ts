import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import isEmail from "validator/lib/isEmail";
import bcrypt from "bcryptjs";
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email must be required"],
      unique: true,
      validate: [isEmail, "Email invalid"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password must be required"],
      minlength: [6, "Password must be at 6 characters"],
    },
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  //mã hóa password
  let user = this;
  if (user.password)
    bcrypt.hash(user.password, 10, function (error, hash) {
      if (error) {
        return next(error);
      } else {
        user.password = hash;
        next();
      }
    });
});
const User = mongoose.model<IUser>("User", userSchema);
export default User;
