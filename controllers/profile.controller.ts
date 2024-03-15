import mongoose from "mongoose";
import Profile from "../models/profile.model";
import Hobbies from "../models/hobbies.model";
//arr theo value
// .filter((key: string) => key !== '_id' && myHobbies.hobby![key as keyof typeof myHobbies.hobby] !== undefined)
//       .map((key: string) => myHobbies.hobby![key as keyof typeof myHobbies.hobby])
export const createProfile = async (req: any, res: any, next: any) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);

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

const shuffleArray = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    // Tạo số ngẫu nhiên j từ 0 đến i
    const j = Math.floor(Math.random() * (i + 1));
    // Hoán đổi phần tử tại i với phần tử tại j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomProfile = async (req: any, res: any, next: any) => {
  try {
    //random ra 1 sở thích bất kì của bản thân
    const myHobbies = await Profile.findOne({ user: req.body.user }).populate({
      path: "hobby",
      model: Hobbies,
      select:
        "sport music pet drink education career zodiac communication things",
    });
    // console.log(myHobbies && myHobbies.hobby ? myHobbies.hobby : "a");

    const randomValHobbies =
      myHobbies && myHobbies.hobby
        ? Object.keys(myHobbies.hobby.toJSON()).filter(
            (key) =>
              key !== "_id" &&
              myHobbies.hobby![key as keyof typeof myHobbies.hobby] !==
                undefined
          )
        : [];

    //tạo mảng random
    shuffleArray(randomValHobbies);
    console.log("randomValHobbies", randomValHobbies);

    const userMatchHobby = await Hobbies.find({
      [randomValHobbies[0]]:
        myHobbies && myHobbies.hobby
          ? myHobbies.hobby![
              randomValHobbies[0] as keyof typeof myHobbies.hobby
            ]
          : [],
    });
    console.log(userMatchHobby);
  } catch (error) {
    throw error;
  }
};
