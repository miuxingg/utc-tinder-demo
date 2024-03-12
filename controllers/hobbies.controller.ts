import mongoose from "mongoose";
import Hobbies from "../models/hobbies.model";

export const createHobbies = async (req: any, res: any, next: any) => {
  try {
    const hobbies = await Hobbies.create({
      sport: req.body.sport,
      music: req.body.music,
      pet: req.body.pet,
      drink: req.body.drink,
      education: req.body.education,
      career: req.body.career,
      zodiac: req.body.zodiac,
      communication: req.body.communication,
      things: req.body.things,
    });

    res.status(200).json({
      status: "success",
      data: hobbies,
    });
  } catch (error) {
    res.json(error);
  }
};
