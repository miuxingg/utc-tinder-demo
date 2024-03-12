import express from "express";
import { createPreferences } from "../controllers/preferences.controller";

const routerPreferences = express.Router();
routerPreferences.route("/createPreferences").post(createPreferences);

export default routerPreferences;
