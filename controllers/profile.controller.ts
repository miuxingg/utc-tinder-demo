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
      location: {
        type: "Point",
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      }
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
    
    let i = 0;
    while (i < randomValHobbies.length) {
      console.log(i);

      const userMatchHobby = await Hobbies.aggregate([
        {
          $match: {
            [randomValHobbies[i]]: 'Basketball'
              // myHobbies && myHobbies.hobby
              //   ? myHobbies.hobby![
              //       randomValHobbies[0] as keyof typeof myHobbies.hobby
              //     ]
              //   : "ABC",
          },
        },
        { $sample: { size: 1 } },
      ]);
      console.log(userMatchHobby);

      if(userMatchHobby.length){
        return res.status(200).json({
          status: "success",
          data: userMatchHobby[i], // Trả về sở thích được chọn ngẫu nhiên
        });
         
      }
      i+=1      
      // userMatchHobby.length
      //   ? (i += 1)
      //   : res.status(200).json({
      //       status: "success",
      //       data: userMatchHobby[0], // Trả về sở thích được chọn ngẫu nhiên
      //     });

      // if (userMatchHobby.length === 0) {
      //   // Nếu không tìm thấy sở thích nào thỏa mãn điều kiện
      //   i+=1
      // }

      // res.status(200).json({
      //   status: "success",
      //   data: userMatchHobby[0], // Trả về sở thích được chọn ngẫu nhiên
      // });
    }
  } catch (error) {
    throw error;
  }
};



function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180; // deg2rad below
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
      0.5 - Math.cos(dLat) / 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      (1 - Math.cos(dLon)) / 2;

  return R * 2 * Math.asin(Math.sqrt(a));
}

export const getNearbyProfiles = async (req, res, next) => {
  try {
      // Assuming your current location is provided in the request body
      const { latitude, longitude } = req.body;

      // Find all profiles
      const allProfiles = await Profile.find({});

      // Filter profiles within 5km radius
      const nearbyProfiles = allProfiles.filter(profile => {
          const distance = calculateDistance(
              latitude,
              longitude,
              profile.latitude,
              profile.longitude
          );
          return distance < 5;
      });

      res.status(200).json({
          status: "success",
          data: nearbyProfiles,
      });
  } catch (error) {
      res.json(error);
  }
};  