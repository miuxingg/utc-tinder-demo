import express from "express";
import {
  createActivity,
  createProfile,
  getMyProfile,
  getRandom10Profile,
  getRandomProfile,
  updateActivity,
  updateProfile,
} from "../controllers/profile.controller";
import { verifyToken } from "../middlewares/verifyToken";

const routerProfile = express.Router();
routerProfile.route("/createProfile").post(verifyToken, createProfile);
routerProfile.route("/updateProfile").put(verifyToken, updateProfile);
routerProfile.route("/getRandomProfile").post(verifyToken, getRandomProfile);
routerProfile.route("/getRandom10Profile").get(verifyToken, getRandom10Profile);
routerProfile.route("/createActivity").post(verifyToken, createActivity);
routerProfile.route("/updateActivity").put(verifyToken, updateActivity);
routerProfile.route("/getMyProfile").get(verifyToken, getMyProfile);

export default routerProfile;
