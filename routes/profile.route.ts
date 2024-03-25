import express from "express";
import {
  createActivity,
  createProfile,
  getRandomProfile,
  updateActivity,
  updateProfile,
} from "../controllers/profile.controller";

const routerProfile = express.Router();
routerProfile.route("/createProfile").post(createProfile);
routerProfile.route("/updateProfile").put(updateProfile);
routerProfile.route("/getRandomProfile").get(getRandomProfile);
routerProfile.route("/createActivity").post(createActivity);
routerProfile.route("/updateActivity").put(updateActivity);

export default routerProfile;
