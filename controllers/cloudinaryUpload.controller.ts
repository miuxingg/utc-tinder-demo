// const fileUploader = require("../configs/cloudinary.config");

import Profile from "../models/profile.model";

// export const uploadImage = async (req: any, res: any, next: any) => {
//   try {
//     console.log("here");

//     fileUploader.single("file")(req, res, (err: any) => {
//       if (err) {
//         next(new Error("Error uploading file!"));
//         return;
//       }

//       if (!req.file) {
//         next(new Error("No file uploaded!"));
//         return;
//       }
//       console.log({ secure_url: req.file.path });

//       res.json({ secure_url: req.file.path });
//     });
//   } catch (error) {
//     console.log("error", error);

//     res.json(error);
//   }
// };

const fileUploader = require("../configs/cloudinary.config");

export const uploadImage = async (req: any, res: any, next: any) => {
  try {
    fileUploader.array("files", 10)(req, res, async (err: any) => {
      console.log("req.files", req.files);
      console.log("req.files.length", req.files.length);
      if (!req.files || req.files.length === 0) {
        next(new Error("Cần ít nhất 1 ảnh!"));
        return;
      }
      if (err) {
        next(new Error("Error uploading files!"));
        return;
      }
      console.log("req.files", req.files);

      const uploadedFiles = req.files.map((file: any) => file.path);
      if (uploadedFiles) {
        const user = req.userId;
        const profile = await Profile.findOneAndUpdate(
          { user },
          { photos: { imageProfileUrl: uploadedFiles } },
          { new: true, runValidator: true }
        );
        res.status(200).json({
          status: "success",
          data: profile,
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    res.json(error);
  }
};
