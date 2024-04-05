import { verifyToken } from "./../middlewares/verifyToken";
import express from "express";
import {
  createActivity,
  deleteAllActivity,
} from "../controllers/activity.controller";

const routerActivity = express.Router();
routerActivity.route("/createActivity").post(verifyToken, createActivity);
routerActivity
  .route("/deleteAllActivity")
  .delete(verifyToken, deleteAllActivity);

export default routerActivity;
