import mongoose from "mongoose";
import Preferences from "../models/preferences.model";

export const createPreferences = async (req: any, res: any, next: any) => {
  const userId = new mongoose.Types.ObjectId(req.body.user);
  try {
    const preferences = await Preferences.create({
      gender: req.body.gender,
      age: req.body.age,
      distance: req.body.distance,
      hobbies: new mongoose.Types.ObjectId(req.body.hobbies),
      user: userId,
      otherUser: new mongoose.Types.ObjectId(req.body.otherUser),
    });

    res.status(200).json({
      status: "success",
      data: preferences,
    });
  } catch (error) {
    res.json(error);
  }
};
