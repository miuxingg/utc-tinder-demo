import bcrypt from "bcryptjs";
import { NextFunction } from "express";
import { IRequest } from "./../interfaces/request.interface";
import User from "../models/users.model";
import jwt, { JwtPayload } from "jsonwebtoken";
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
          { expiresIn: "100m" }
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

        res.status(201).json(response);
        // res.cookie("tokenTinder", accessToken).status(201).json(response);
      } else {
        const err = new Error("password is not correct");
        return next(err);
      }
  } catch (error) {
    next(error);
  }
};

export const token = async (req: any, res: any, next: any) => {
  //refresh the damn token
  const postData = req.body;
  const { userId } = jwt.verify(
    postData.refreshToken,
    process.env.APP_SECRET!
  ) as JwtPayload;
  // if refresh token exists
  if (postData.refreshToken) {
    const accessToken = jwt.sign({ userId: userId }, process.env.APP_SECRET!, {
      expiresIn: "100m",
    });
    // const refreshToken = jwt.sign({ userId: userId }, process.env.APP_SECRET!, {
    //   expiresIn: "7d",
    // });
    const response = {
      accessToken: accessToken,
      refreshToken: postData.refreshToken,
    };
    // update the token in the list
    res.status(200).json(response);
  } else {
    res.status(404).send("Invalid request");
  }
};
