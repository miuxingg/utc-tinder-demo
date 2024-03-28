import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { IRequest } from "../interfaces/request.interface";
import IError from "../interfaces/error.interface";
export const verifyToken = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("run into verifyToken");

  const Authorization = req.header("authorization");
  /* const token = Authorization?.replace('Bearer ','') */
  //**********    TEST
  let accessToken = Authorization?.replace("Bearer ", ""); //nhớ ph có cả dấu space
  //**********

  console.log(accessToken);

  if (!accessToken || String(accessToken) === "null") {
    const err: IError = {
      message: "Unauthorization",
      statusCode: 401,
    };

    return next(err);
  }

  //verify
  try {
    const payload = jwt.verify(
      accessToken,
      process.env.APP_SECRET!
    ) as JwtPayload;
    const { userId } = payload;
    req.userId = userId;
    next();
  } catch (error) {
    const err: IError = {
      message: "Unauthorization",
      statusCode: 401,
    };
    return next(err);
  }
};
