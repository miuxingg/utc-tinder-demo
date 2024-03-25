import bcrypt from "bcryptjs";
import { NextFunction } from "express";
import { IRequest } from "./../interfaces/request.interface";
import User from "../models/users.model";
import jwt from "jsonwebtoken";
//register
export const register = async (req: any, res: any, next: any) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

//login
export const login = async (req: IRequest, res: any, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const err = new Error("email is not correct");
      // err.statusCode = 400
      return next(err);
    }

    if (user.password)
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const accessToken = jwt.sign(
          { userId: user._id },
          process.env.APP_SECRET!,
          { expiresIn: "10m" }
        );
        const refreshToken = jwt.sign(
          { userId: user._id },
          process.env.APP_SECRET!,
          { expiresIn: "7d" }
        );
        const response = {
          status: "success",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: user,
        };
        res.cookie("tokenTinder", accessToken).status(201).json(response);
      } else {
        const err = new Error("password is not correct");
        return next(err);
      }
  } catch (error) {
    next(error);
  }
};
