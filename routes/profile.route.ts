import express from "express";
import {
  createProfile,
  updateProfile,
} from "../controllers/profile.controller";

const routerProfile = express.Router();
routerProfile.route("/createProfile").post(createProfile);
routerProfile.route("/updateProfile").put(updateProfile);

export default routerProfile;
