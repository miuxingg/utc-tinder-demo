import express from "express";
import {
  createPreferences,
  updatePreferences,
} from "../controllers/preferences.controller";
import { verifyToken } from "../middlewares/verifyToken";

const routerPreferences = express.Router();
routerPreferences
  .route("/createPreferences")
  .post(verifyToken, createPreferences);
routerPreferences
  .route("/updatePreferences")
  .put(verifyToken, updatePreferences);

export default routerPreferences;
