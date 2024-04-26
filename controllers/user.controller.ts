import bcrypt from "bcryptjs";
import { NextFunction } from "express";
import { IRequest } from "./../interfaces/request.interface";
import User from "../models/users.model";
import jwt, { JwtPayload } from "jsonwebtoken";
const nodemailer = require("nodemailer");
const crypto = require("crypto");
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
    console.error(error);
  }
};

export const token = async (req: any, res: any, next: any) => {
  const postData = req.body;

  try {
    if (postData.refreshToken) {
      try {
        const { userId } = jwt.verify(
          postData.refreshToken,
          process.env.APP_SECRET!
        ) as JwtPayload;

        // Tạo accessToken mới
        const accessToken = jwt.sign(
          { userId: userId },
          process.env.APP_SECRET!,
          {
            expiresIn: "100m",
          }
        );

        // Trả về response mới
        const response = {
          accessToken: accessToken,
          refreshToken: postData.refreshToken,
        };
        res.status(200).json(response);
      } catch (err) {
        // Nếu refreshToken hết hạn hoặc không hợp lệ
        res.status(401).send("Refresh token expired or invalid");
      }
    } else res.status(404).send("Invalid request");
  } catch (error) {
    res.status(404).send("Invalid request");
  }
};

export const getCurrentUser = async (req: any, res: any, next: any) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) return res.status(400).send("This user doesn't exist");
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.error(err);
  }
};

export const changePassword = async (req: any, res: any, next: any) => {
  try {
    const myUser = await User.findById(req.userId);
    const { currentPassword, newPassword } = req.body;
    console.log({ currentPassword, newPassword });

    if (newPassword && myUser?.password) {
      const compare = await bcrypt.compare(currentPassword, myUser?.password);
      if (compare) {
        const hashPass = await bcrypt.hash(newPassword, 10);
        const userUpdatePass = await User.findByIdAndUpdate(
          { _id: req.userId },
          { password: hashPass },
          {
            new: true,
            runValidators: true,
          }
        );

        res.status(200).json({
          status: "success",
          data: userUpdatePass,
        });
      } else {
        const err = new Error("mật khẩu hiện tại không đúng");
        return next(err);
      }
    } else {
      const err = new Error("current password is not correct");
      return next(err);
    }
  } catch (error) {}
};

// export const resetPasswordByMail = async (req: any, res: any, next: any) => {
//   try {
//     await sendPasswordResetEmail("a", "b");
//     res.status(200).json({
//       status: "success",
//     });
//   } catch (error) {
//     res.json(error);
//   }
// };
// async function sendPasswordResetEmail(to: any, newPassword: any) {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     service: "Gmail",
//     auth: {
//       user: "himatchs@gmail.com",
//       pass: "son270802",
//     },
//   });
//   //ywve xsws teps wodo
//   const mailOptions = {
//     from: "himatchs@gmail.com",
//     to: "nguynson270802@gmail.com",
//     subject: "Hello User✔",
//     text: `Hello,\n\nYour new password is: 123456`,
//     html: `
//         <html>
//         <head>
//             <style>
//                 .container {
//                     max-width: 600px;
//                     margin: 0 auto;
//                     padding: 20px;
//                     background-color: #f5f5f5;
//                     font-family: Arial, sans-serif;
//                 }
//                 .password-box {
//                     background-color: #ffffff;
//                     padding: 10px;
//                     border: 1px solid #cccccc;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <p>Hello,</p>
//                 <p>Your new password is:</p>
//                 <div class="password-box">
//                     <strong>${newPassword}</strong>
//                 </div>
//                 <p>Best regards,</p>
//                 <p>Your Name</p>
//             </div>
//         </body>
//         </html>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// }

export const sendMail = async (req: any, res: any, next: any) => {
  console.log("req.body.emailReset", req.body.emailReset);

  try {
    const newPassword = crypto.randomBytes(5).toString("hex");
    const hashPass = await bcrypt.hash(newPassword, 10);

    try {
      const userReset = await User.findOneAndUpdate(
        { email: req.body.emailReset },
        { password: hashPass },
        { new: true, runValidator: true }
      );
      if (userReset) {
        await sendPasswordResetEmail(
          req.body.emailReset,
          newPassword as string
        );
        res.status(200).json({
          status: "success",
        });
      } else {
        const err = new Error("Không tìm thấy Email nguời dùng");
        next(err);
      }
    } catch (error) {
      next(error);
    }
  } catch (error) {
    res.json(error);
  }
};
async function sendPasswordResetEmail(to: any, newPassword: any) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "himatchs@gmail.com",
      pass: "dyou ggut slwl hazy",
    },
  });

  const mailOptions = {
    from: "himatchs@gmail.com",
    to: `${to}`,
    subject: "Your new password",
    text: `Your new password is: 123456`,
    html: `
        <html>
        <head>
            <style>
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                    font-family: Arial, sans-serif;
                }
                .password-box {
                    background-color: #ffffff;
                    padding: 10px;
                    border: 1px solid #cccccc;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <p>Hello,</p>
                <p>Your new password is:</p>
                <div class="password-box">
                    <strong>${newPassword}</strong>
                </div>
                <p>Best regards,</p>
                <p>HiMatch Support</p>
            </div>
        </body>
        </html>
    `,
  };

  const res = await transporter.sendMail(mailOptions);
  return res;
}
