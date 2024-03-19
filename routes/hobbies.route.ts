import express from "express";
import {
  createHobbies,
  genarateHobbies,
  updateHobbies,
} from "../controllers/hobbies.controller";

const routerHobbies = express.Router();
routerHobbies.route("/createHobbies").post(createHobbies);
routerHobbies.route("/updateHobbies").put(updateHobbies);
routerHobbies.route("/genarateHobbies").post(genarateHobbies);

export default routerHobbies;
