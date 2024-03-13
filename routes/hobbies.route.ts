import express from "express";
import {
  createHobbies,
  updateHobbies,
} from "../controllers/hobbies.controller";

const routerHobbies = express.Router();
routerHobbies.route("/createHobbies").post(createHobbies);
routerHobbies.route("/updateHobbies").put(updateHobbies);

export default routerHobbies;
