import mongoose from "mongoose";
import Preferences from "../models/preferences.model";

export const createPreferences = async (req: any, res: any, next: any) => {
  const user = new mongoose.Types.ObjectId(req.userId);
  try {
    const preferences = await Preferences.create({
      gender: "Male",
      age: { minAge: 18, maxAge: 100 },
      distance: 100,
      user,
    });

    res.status(200).json({
      status: "success",
      data: preferences,
    });
  } catch (error) {
    res.json(error);
  }
};

export const updatePreferences = async (req: any, res: any, next: any) => {
  try {
    const user = req.userId;
    const preferences = await Preferences.findOneAndUpdate(
      { user },
      { ...req.body },
      { new: true, runValidator: true }
    );
    res.status(200).json({
      status: "success",
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
};
