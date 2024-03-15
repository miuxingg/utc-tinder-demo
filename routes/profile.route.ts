import express from "express";
import {
  createProfile,
  getRandomProfile,
  updateProfile,
} from "../controllers/profile.controller";

const routerProfile = express.Router();
routerProfile.route("/createProfile").post(createProfile);
routerProfile.route("/updateProfile").put(updateProfile);
routerProfile.route("/getRandomProfile").get(getRandomProfile);

export default routerProfile;
