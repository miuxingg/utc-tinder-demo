import express from "express";
import { createActivity } from "../controllers/activity.controller";

const routerActivity = express.Router();
routerActivity.route("/createActivity").post(createActivity);

export default routerActivity;
