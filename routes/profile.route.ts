import express from "express";
import {
  createActivity,
  createProfile,
  getRandomProfile,
  updateProfile,
} from "../controllers/profile.controller";

const routerProfile = express.Router();
routerProfile.route("/createProfile").post(createProfile);
routerProfile.route("/updateProfile").put(updateProfile);
routerProfile.route("/getRandomProfile").get(getRandomProfile);
routerProfile.route("/createActivity").post(createActivity);

export default routerProfile;
