import { verifyToken } from "../middlewares/verifyToken";
import express from "express";
import { uploadImage } from "../controllers/cloudinaryUpload.controller";

const routerCloudinaryUpload = express.Router();
routerCloudinaryUpload
  .route("/cloudinary-upload")
  .post(verifyToken, uploadImage);

export default routerCloudinaryUpload;
