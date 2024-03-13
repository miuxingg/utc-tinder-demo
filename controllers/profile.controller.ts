import mongoose from "mongoose";
import Profile from "../models/profile.model";

export const createProfile = async (req: any, res: any, next: any) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const profile = await Profile.create({
      user: userId,
      hobby: new mongoose.Types.ObjectId(req.body.hobby),
      title: req.body.title,
      description: req.body.description,
      photos: req.body.photos,
      age: req.body.age,
      gender: req.body.gender,
      adress: req.body.adress,
    });

    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    res.json(error);
  }
};

export const updateProfile = async (req: any, res: any, next: any) => {
  try {
    const user = req.body.userId;
    const profile = await Profile.findOneAndUpdate(
      { user },
      { ...req.body },
      { new: true, runValidator: true }
    );
    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    res.json(error);
  }
};
