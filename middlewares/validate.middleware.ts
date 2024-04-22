import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.status = err.status || 500;
  console.log("err.status", err.status);
  console.log("err.message", err.message);

  //Handling: bắt lỗi khi người dùng không nhập với các trường required
  if (err.errors) {
    err.status = 400;
    err.message = [];
    for (let p in err.errors) {
      err.message.push(err.errors[p].properties!.message!);
    }
  }
  //Handling: bắt lỗi username không tồn tại hay các ID trên params sai khi put hay delete
  //   if (err.kind === 'ObjectId') {
  //     err = { ...err, ...validate("Doesn't exist", 400) };
  //   }

  //Handling: bắt lỗi các trường unique
  if (err.code === 11000) {
    err.status = 400;
    err.message = [];
    for (let keys in err.keyValue) {
      err.message.push(err.keyValue[keys] + " has already existed");
    }
  }
  //trả về dữ liệu cho client
  res.status(err.status!).json({
    status: "failed",
    statusCode: err.status,
    message: err.message,
  });
};
