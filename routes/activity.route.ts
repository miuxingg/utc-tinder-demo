import { verifyToken } from "./../middlewares/verifyToken";
import express from "express";
import { createActivity } from "../controllers/activity.controller";

const routerActivity = express.Router();
routerActivity.route("/createActivity").post(verifyToken, createActivity);

export default routerActivity;
