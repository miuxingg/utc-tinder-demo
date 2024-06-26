import express from "express";
import {
  checkExistProfile,
  createActivity,
  createProfile,
  getListMatch,
  getMyProfile,
  getRandom10Profile,
  getRandomProfile,
  moveToHeadListMatch,
  updateActivity,
  updateLocation,
  updateProfile,
} from "../controllers/profile.controller";
import { verifyToken } from "../middlewares/verifyToken";

const routerProfile = express.Router();
routerProfile.route("/createProfile").post(verifyToken, createProfile);
routerProfile.route("/checkExistProfile").get(verifyToken, checkExistProfile);
routerProfile.route("/updateProfile").put(verifyToken, updateProfile);
routerProfile.route("/getRandomProfile").post(verifyToken, getRandomProfile);
routerProfile.route("/getRandom10Profile").get(verifyToken, getRandom10Profile);
routerProfile.route("/createActivity").post(verifyToken, createActivity);
routerProfile.route("/updateActivity").put(verifyToken, updateActivity);
routerProfile.route("/getMyProfile").get(verifyToken, getMyProfile);
routerProfile.route("/getListMatch").get(verifyToken, getListMatch);
routerProfile.route("/updateLocation").put(verifyToken, updateLocation);
routerProfile.route("/moveToHeadListMatch").put(verifyToken, moveToHeadListMatch);

export default routerProfile;
