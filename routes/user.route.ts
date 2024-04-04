import express from "express";
import { login, register, token } from "../controllers/user.controller";

const routerUser = express.Router();
routerUser.route("/register").post(register);
routerUser.route("/login").post(login);
routerUser.route("/token").post(token);

export default routerUser;
