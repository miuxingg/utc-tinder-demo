import express from "express";
import { createProfile } from "../controllers/profile.controller";

const routerProfile = express.Router();
routerProfile.route("/createProfile").post(createProfile);

export default routerProfile;
