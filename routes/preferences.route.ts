import express from "express";
import {
  createPreferences,
  updatePreferences,
} from "../controllers/preferences.controller";

const routerPreferences = express.Router();
routerPreferences.route("/createPreferences").post(createPreferences);
routerPreferences.route("/updatePreferences").put(updatePreferences);

export default routerPreferences;
