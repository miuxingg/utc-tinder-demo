import mongoose from "mongoose";
import Profile from "../models/profile.model";
import { IActivityTypes } from "../interfaces/activity.interface";
import Activity from "../models/activity.model";
import Preferences from "../models/preferences.model";
import Message from "../models/message.model";

export const createProfile = async (req: any, res: any, next: any) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const preferrence = await Preferences.findOne({ user: req.userId });

    const profile = await Profile.create({
      user: userId,
      hobby: req.body.hobby
        ? req.body.hobby.map(
            (hobbyId: string) => new mongoose.Types.ObjectId(hobbyId)
          )
        : [],
      title: req.body.title,
      description: req.body.description,
      // photos: req.body.photos ? req.body.photos : {},
      age: req.body.age,
      gender: req.body.gender,
      adress: req.body.adress,
      preferences: new mongoose.Types.ObjectId(preferrence?._id),
      listmatch: [],
      location: {
        type: "Point",
        coordinates: [
          parseFloat(req.body.longitude ? req.body.longitude : 0),
          parseFloat(req.body.latitude ? req.body.latitude : 0),
        ],
      },
    });
    console.log("profile", profile);

    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    console.log("error", error);

    res.json(error);
  }
};

export const checkExistProfile = async (req: any, res: any, next: any) => {
  try {
    console.log('here');
    
    const profile = await Profile.findOne({ user: req.userId });
    res.status(200).json({
      status: "success",
      data: profile,
    });
    console.log('profile',profile);
    
  } catch (error) {
    console.log('no profile');
    res.json("no profile");
  }
};
export const updateProfile = async (req: any, res: any, next: any) => {
  try {
    const user = req.userId;
    const profile = await Profile.findOneAndUpdate(
      { user },
      { ...req.body },
      { new: true, runValidator: true }
    ).populate({
      path: "hobby",
      select: "_id name type",
    });
    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    res.json(error);
  }
};

export const updateLocation = async(req: any, res: any, next: any)=>{
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      {
        $set: {
          "location.coordinates": [
            parseFloat(req.body.longitude),
            parseFloat(req.body.latitude),
          ],
        },
      },
      { new: true, runValidator: true  } 
    );
      res.status(200).json({
        status: "success",
        data: profile,
      });
  } catch (error) {
    next(error)
  }
  
}
export const createActivity = async (req: any, res: any, next: any) => {
  try {
    // const activity = await Activity.create({
    //   senderUser: req.body.senderUser,
    //   receiverUser: req.body.receiverUser,
    // });
    res.status(200).json({
      status: "success",
      // data: activity,
    });
  } catch (error) {
    res.json(error);
  }
};
export const getListMatch = async (req: any, res: any, next: any) => {
  try {
    const myProfile = await Profile.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "listmatch",
          foreignField: "_id",
          as: "listMatches",
        },
      },
      {
        $unwind: "$listMatches",
      },
      {
        $lookup: {
          from: "users",
          localField: "listMatches.user",
          foreignField: "_id",
          as: "listMatchesUser",
        },
      },
      {
        $unwind: "$listMatchesUser",
      },
      {
        $addFields: {
          user: "$listMatches.user",
          firstName: "$listMatchesUser.firstName",
          lastName: "$listMatchesUser.lastName",
          photos: "$listMatches.photos",
        },
      },
      {
        $project: {
          user: 1,
          firstName: 1,
          lastName: 1,
          "photos.imageProfileUrl": 1,
          _id: 0,
        },
      },
    ]);
    if (!myProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const listUser = myProfile.map(user => user.user);

  // Fetch the latest message for each user in listUser
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: { $in: listUser } },
          { recipient: { $in: listUser } }
        ]
      }
    },
    {
      $sort: { createdAt: -1 } // Sort by createdAt in descending order
    },
    {
      $group: {
        _id: {
          $cond: [
            { $in: ["$sender", listUser] },
            "$sender",
            "$recipient"
          ]
        },
        mostRecentMessage: { $first: "$$ROOT" }
      }
    },
    {
      $sort: { "mostRecentMessage.createdAt": -1 } // Sort groups by the most recent message
    }
  ]).exec();

  // Create a map to track the most recent message time for each user
  const userMessageMap = new Map();
  messages.forEach(msg => {
    userMessageMap.set(msg._id.toString(), msg.mostRecentMessage.createdAt);
  });

  // Sort listUser based on the most recent message time
  myProfile.sort((a, b) => {
    const aTime = userMessageMap.get(a.user.toString()) || new Date(0);
    const bTime = userMessageMap.get(b.user.toString()) || new Date(0);
    return bTime - aTime;
  });

  // return listUser;
    res.status(200).json({
      status: "success",
      data: myProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error });
  }
};

//chuyển userId trong listMatch có activity lên đầu
export const moveToHeadListMatch= async (req: any, res: any, next: any) => {
  try {
    await Profile.updateOne(
      { user: req.userId },
      { $pull: { listmatch: req.body.userId } }
    );
  
    // Add the userId to the beginning of the array
    const profile = await Profile.updateOne(
      { user: req.userId },
      { $push: { listmatch: { $each: [req.body.userId], $position: 0 } } }
    );
    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    next(error)
  }
}
export const getMyProfile = async (req: any, res: any, next: any) => {
  try {
    const myProfile = await Profile.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "hobbies",
          localField: "hobby",
          foreignField: "_id",
          as: "hobby",
        },
      },
      {
        $lookup: {
          from: "preferences",
          localField: "preferences",
          foreignField: "_id",
          as: "preferences",
        },
      },
      {
        $unwind: {
          path: "$preferences",
          preserveNullAndEmptyArrays: true, // Chỉ định nếu muốn giữ các document không có preferences
        },
      },

      {
        $project: {
          "hobby._id": 1,
          "hobby.name": 1,
          "hobby.type": 1,
          description: 1,
          title: 1,
          adress: 1,
          age: 1,
          gender: 1,
          "preferences.age.minAge": 1,
          "preferences.age.maxAge": 1,
          "preferences.distance": 1,
          "preferences.gender": 1,
          "photos.imageProfileUrl": 1,
          "listmatch.photos.imageProfileUrl": 1,
          "listmatch.user.firstName": 1,
          "listmatch.user.lastName": 1,
          "listmatch.user._id": 1,
        },
      },
    ]);
    if (!myProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({
      status: "success",
      data: myProfile[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error });
  }
};

//khi người dùng quẹt trái, phải ứng dụng sẽ cập nhật trạng thái thích hay không thích
export const updateActivity = async (req: any, res: any, next: any) => {
  try {
    const updateActivity = await Activity.findOneAndUpdate(
      {
        $and: [
          { senderUser: req.body.senderUser },
          { receiverUser: req.userId }, //req.body.receiverUser
        ],
      },
      { receiverType: req.body.receiverType },
      { new: true, runValidator: true }
    );
    console.log("inupdate", updateActivity);

    if (updateActivity) {
      if (
        updateActivity.receiverType === "Like" &&
        updateActivity.senderType === "Like"
      )
        res.status(200).json({ status: "match" });
      else {
        res.status(200).json({
          status: "success",
          data: updateActivity,
        });
      }
      //activity.received
    } else {
      const newActivity = await Activity.create({
        senderUser: req.userId,
        senderType: req.body.senderType,
        receiverUser: req.body.receiverUser,
      });
      const updateProfile = await Profile.updateMany(
        {
          user: { $in: [req.userId, req.body.receiverUser] },
        },
        {
          $addToSet: { activity: newActivity._id },
        },
        { new: true }
        // { $push: { activity: newActivity._id } },
      );
      res.status(200).json({
        status: "success",
        data: newActivity,
        data1: updateProfile,
      });
    }
  } catch (error) {
    res.json(error);
  }
};

export const getRandomProfile = async (req: any, res: any, next: any) => {
  try {
    const myProfile = await Profile.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "preferences",
          localField: "preferences",
          foreignField: "_id",
          as: "preferences",
        },
      },
      {
        $unwind: {
          path: "$preferences",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          hobby: 1,
          location: 1,
          "preferences.age.minAge": 1,
          "preferences.age.maxAge": 1,
          "preferences.distance": 1,
          "preferences.gender": 1,
        },
      },
      { $limit: 1 },
    ]);

    const radius = myProfile[0]?.preferences
      ? myProfile[0]?.preferences.distance * 1000
      : 90000 * 1000; // 5km radius
    const coordinates: [number, number] = myProfile[0]?.location
      ? [
          parseFloat(myProfile[0]?.location.coordinates[0]),
          parseFloat(myProfile[0]?.location.coordinates[1]),
        ]
      : [105.7804153, 21.0061428];

    const randomKeyHobby =
      myProfile && myProfile[0].hobby
        ? myProfile[0].hobby[
            Math.floor(Math.random() * myProfile[0].hobby.length)
          ]
        : undefined;

    const profiles = await Profile.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: coordinates,
          },
          distanceField: "distance",
          maxDistance: radius,
          spherical: true,
        },
      },
      {
        $match: {
          _id: {
            $nin: req.body.idArray.map(
              (id: string) => new mongoose.Types.ObjectId(id)
            ),
          },
          user: { $ne: new mongoose.Types.ObjectId(req.userId) },
        },
      },
      {
        $match: {
          age: {
            $gte: myProfile[0]?.preferences
              ? myProfile[0]?.preferences.age.minAge
              : 18,
            $lte: myProfile[0]?.preferences
              ? myProfile[0]?.preferences.age.maxAge
              : 202,
          },
          gender: myProfile[0]?.preferences
            ? myProfile[0]?.preferences.gender
            : { $in: ["Male", "Female"] },
        },
      },
      {
        $lookup: {
          from: "activities",
          localField: "activity",
          foreignField: "_id",
          as: "activity",
        },
      },
      {
        $match: {
          $and: [
            {
              $and: [
                {
                  $or: [
                    {
                      $and: [
                        {
                          "activity.receiverUser": req.userId,
                        },
                        {
                          "activity.receiverType": {
                            $nin: [IActivityTypes.like, IActivityTypes.unlike],
                          },
                        },
                      ],
                    },
                    {
                      $and: [
                        {
                          "activity.senderUser": {
                            $ne: new mongoose.Types.ObjectId(req.userId),
                          },
                        },
                        {
                          "activity.receiverUser": {
                            $ne: new mongoose.Types.ObjectId(req.userId),
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "hobbies",
          localField: "hobby",
          foreignField: "_id",
          as: "hobby",
        },
      },
      {
        $lookup: {
          from: "preferences",
          localField: "preferences",
          foreignField: "_id",
          as: "preferences",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $set: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
      {
        $project: {
          "hobby._id": 1,
          "hobby.name": 1,
          "hobby.type": 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user._id": 1,
          title: 1,
          description: 1,
          age: 1,
          gender: 1,
          adress: 1,
          location: 1,
          preferences: 1,
          distance: 1,
          activity: 1,
          "photos.imageProfileUrl": 1,
        },
      },
      {
        $facet: {
          match1: [
            {
              $match: {
                hobby: randomKeyHobby,
              },
            },
          ],
          match2: [
            {
              $match: {},
            },
          ],
        },
      },
      {
        $project: {
          result: {
            $cond: {
              if: { $gt: [{ $size: "$match1" }, 0] },
              then: "$match1",
              else: "$match2",
            },
          },
        },
      },
      {
        $unwind: "$result",
      },
      {
        $replaceRoot: { newRoot: "$result" },
      },
      { $limit: 1 },
    ]);
    console.log("profiles controller", profiles);

    if (profiles.length > 0) {
      res.status(200).json({
        status: "success",
        data: profiles[0],
      });
    } else {
      res.status(200).json({
        status: "nope",
      });
    }
  } catch (error) {
    res.json(error);
  }
};

export const getRandom10Profile = async (req: any, res: any, next: any) => {
  try {
    // const radius = 5000; // 5km radius
    // const coordinates: [number, number] = [
    //   parseFloat(req.body.longitude),
    //   parseFloat(req.body.latitude),
    // ];
    //random ra 1 sở thích bất kì của bản thân
    // const myProfile = await Profile.findOne({ user: req.userId }).populate({
    //   path: "preferences",
    //   select: "gender distance age.minAge age.maxAge",
    // });

    //random ra 1 sở thích bất kì của bản thân

    const myProfile = await Profile.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "preferences",
          localField: "preferences",
          foreignField: "_id",
          as: "preferences",
        },
      },
      {
        $unwind: {
          path: "$preferences",
          preserveNullAndEmptyArrays: true, // Bảo toàn các documents của profile nếu không có preferences
        },
      },
      {
        $project: {
          _id: 1,
          hobby: 1,
          location: 1,
          "preferences.age.minAge": 1,
          "preferences.age.maxAge": 1,
          "preferences.distance": 1,
          "preferences.gender": 1,
        },
      },
      { $limit: 1 },
    ]);

    const radius = myProfile[0]?.preferences
      ? myProfile[0]?.preferences.distance * 1000
      : 90000 * 1000; // 5km radius
    const coordinates: [number, number] = myProfile[0]?.location
      ? [
          parseFloat(myProfile[0]?.location.coordinates[0]),
          parseFloat(myProfile[0]?.location.coordinates[1]),
        ]
      : [105.7804153, 21.0061428];

    const randomKeyHobby =
      myProfile && myProfile[0].hobby
        ? myProfile[0].hobby[
            Math.floor(Math.random() * myProfile[0].hobby.length)
          ]
        : undefined;

    const profiles = await Profile.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: coordinates,
          },
          distanceField: "distance",
          maxDistance: radius,
          spherical: true,
        },
      },
      {
        $match: {
          //khi làm thật nhớ thêm dòng dưới vào. suộc đi vì chỉ dg test
          user: { $ne: new mongoose.Types.ObjectId(req.userId) },
          age: {
            $gte: myProfile[0]?.preferences
              ? myProfile[0]?.preferences.age.minAge
              : 18,
            $lte: myProfile[0]?.preferences
              ? myProfile[0]?.preferences.age.maxAge
              : 202,
          },
          gender: myProfile[0]?.preferences
            ? myProfile[0]?.preferences.gender
            : { $in: ["Male", "Female"] },
        },
      },
      {
        $lookup: {
          from: "activities",
          localField: "activity",
          foreignField: "_id",
          as: "activity",
        },
      },
      {
        $match: {
          $and: [
            {
              $and: [
                {
                  $or: [
                    {
                      $and: [
                        {
                          "activity.receiverUser": new mongoose.Types.ObjectId(
                            req.userId
                          ),
                        },
                        {
                          "activity.receiverType": {
                            $nin: [IActivityTypes.like, IActivityTypes.unlike],
                          },
                        },
                      ],
                    },
                    {
                      $and: [
                        {
                          "activity.senderUser": {
                            $ne: new mongoose.Types.ObjectId(req.userId),
                          },
                        },
                        {
                          "activity.receiverUser": {
                            $ne: new mongoose.Types.ObjectId(req.userId),
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "hobbies",
          localField: "hobby",
          foreignField: "_id",
          as: "hobby",
        },
      },
      {
        $lookup: {
          from: "preferences",
          localField: "preferences",
          foreignField: "_id",
          as: "preferences",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $set: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
      {
        $project: {
          "hobby._id": 1,
          "hobby.name": 1,
          "hobby.type": 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user._id": 1,
          title: 1,
          description: 1,
          age: 1,
          gender: 1,
          adress: 1,
          location: 1,
          preferences: 1,
          distance: 1,
          activity: 1,
          "photos.imageProfileUrl": 1,
        },
      },
      {
        $facet: {
          match1: [
            {
              $match: {
                hobby: randomKeyHobby,
              },
            },
          ],
          match2: [
            {
              $match: {},
            },
          ],
        },
      },
      {
        $project: {
          result: {
            $cond: {
              if: { $gt: [{ $size: "$match1" }, 0] },
              then: "$match1",
              else: "$match2",
            },
          },
        },
      },
      {
        $unwind: "$result",
      },
      {
        $replaceRoot: { newRoot: "$result" },
      },
      { $limit: 3 },
    ]);
    res.json(profiles);
  } catch (error) {
    res.json(error);
  }
};

// export const findProfilesWithinRadius = async (
//   longitude: number,
//   latitude: number
// ) => {
//   try {
//     const radius = 5000; // 5km radius
//     const coordinates = [longitude, latitude];

//     const profiles = await Profile.find({
//       location: {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: coordinates,
//           },
//           $maxDistance: radius,
//         },
//       },
//     });

//     return profiles;
//   } catch (error) {
//     throw error;
//   }
// };

// {
//   try {
//     //random ra 1 sở thích bất kì của bản thân
//     const myHobbies = await Profile.findOne({ user: req.body.user }).populate({
//       path: "hobby",
//       model: Hobbies,
//       select:
//         "sport music pet drink education career zodiac communication things",
//     });
//     // console.log(myHobbies && myHobbies.hobby ? myHobbies.hobby : "a");

//     const randomValHobbies =
//       myHobbies && myHobbies.hobby
//         ? Object.keys(myHobbies.hobby.toJSON()).filter(
//             (key) =>
//               key !== "_id" &&
//               myHobbies.hobby![key as keyof typeof myHobbies.hobby] !==
//                 undefined
//           )
//         : [];

//     //tạo mảng random
//     shuffleArray(randomValHobbies);
//     console.log("randomValHobbies", randomValHobbies);

//     let i = 0;
//     while (i < randomValHobbies.length) {
//       console.log(i);

//       const userMatchHobby = await Hobbies.aggregate([
//         {
//           $match: {
//             [randomValHobbies[i]]: "Basketball",
//             // myHobbies && myHobbies.hobby
//             //   ? myHobbies.hobby![
//             //       randomValHobbies[0] as keyof typeof myHobbies.hobby
//             //     ]
//             //   : "ABC",
//           },
//         },
//         { $sample: { size: 1 } },
//       ]);
//       console.log(userMatchHobby);

//       if (userMatchHobby.length) {
//         return res.status(200).json({
//           status: "success",
//           data: userMatchHobby[i], // Trả về sở thích được chọn ngẫu nhiên
//         });
//       }
//       i += 1;
//       // userMatchHobby.length
//       //   ? (i += 1)
//       //   : res.status(200).json({
//       //       status: "success",
//       //       data: userMatchHobby[0], // Trả về sở thích được chọn ngẫu nhiên
//       //     });

//       // if (userMatchHobby.length === 0) {
//       //   // Nếu không tìm thấy sở thích nào thỏa mãn điều kiện
//       //   i+=1
//       // }

//       // res.status(200).json({
//       //   status: "success",
//       //   data: userMatchHobby[0], // Trả về sở thích được chọn ngẫu nhiên
//       // });
//     }
//   } catch (error) {
//     throw error;
//   }
// }

// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Radius of the earth in km
//   const dLat = ((lat2 - lat1) * Math.PI) / 180; // deg2rad below
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     0.5 -
//     Math.cos(dLat) / 2 +
//     (Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       (1 - Math.cos(dLon))) /
//       2;

//   return R * 2 * Math.asin(Math.sqrt(a));
// }
// export const getNearbyProfiles = async (req, res, next) => {
//   try {
//       // Assuming your current location is provided in the request body
//       const { latitude, longitude } = req.body;

//       // Find all profiles
//       const allProfiles = await Profile.find({});

//       // Filter profiles within 5km radius
//       const nearbyProfiles = allProfiles.filter(profile => {
//           const distance = calculateDistance(
//               latitude,
//               longitude,
//               profile.latitude,
//               profile.longitude
//           );
//           return distance < 5;
//       });

//       res.status(200).json({
//           status: "success",
//           data: nearbyProfiles,
//       });
//   } catch (error) {
//       res.json(error);
//   }
// };

// const mainCondition = {
//   [`hobby.${randomKeyHobby}`]: myHobbies && myHobbies.hobby ? myHobbies.hobby[randomKeyHobby] : undefined,
// };

// const fallbackCondition = {
//   // Điều kiện dự phòng của bạn
//   // Ví dụ: "age": {$gt: 18}
// };

// let profiles = await Profile.aggregate([
//   {
//     $match: {
//       $or: [
//         mainCondition,
//         fallbackCondition
//       ]
//     },
//   },
// ]);

// const shuffleArray = (array: any) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     // Tạo số ngẫu nhiên j từ 0 đến i
//     const j = Math.floor(Math.random() * (i + 1));
//     // Hoán đổi phần tử tại i với phần tử tại j
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// };

//arr theo value
// .filter((key: string) => key !== '_id' && myHobbies.hobby![key as keyof typeof myHobbies.hobby] !== undefined)
//       .map((key: string) => myHobbies.hobby![key as keyof typeof myHobbies.hobby])

// const arKeyHobbies =
//   myHobbies && myHobbies.hobby
//     ?  Object.keys(myHobbies.hobby.toJSON()).filter((key) => {
//         return (
//           key !== "_id" &&
//           myHobbies.hobby![key as keyof typeof myHobbies.hobby] !==
//             undefined
//         );
//       })
//     : [];

// export const getRandomProfile = async (req: any, res: any, next: any) => {
//   try {
//     const radius = 5000; // 5km radius
//     const coordinates: [number, number] = [
//       parseFloat(req.body.longitude),
//       parseFloat(req.body.latitude),
//     ];
//     //random ra 1 sở thích bất kì của bản thân
//     const myProfile = await Profile.findOne({ user: req.body.user });
//     console.log("here", myProfile);

//     const randomKeyHobby =
//       myProfile && myProfile.hobby
//         ? myProfile.hobby[Math.floor(Math.random() * myProfile.hobby.length)]
//         : undefined;
//     console.log(randomKeyHobby);

//     const profiles = await Profile.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: "Point",
//             coordinates: coordinates,
//           },
//           distanceField: "distance",
//           maxDistance: radius,
//           spherical: true,
//         },
//       },
//       {
//         $match: {
//           age: { $gte: req.body.minAge, $lte: req.body.maxAge },
//           gender: req.body.gender,
//         },
//       },
//       {
//         $lookup: {
//           from: "activities",
//           localField: "activity",
//           foreignField: "_id",
//           as: "activity",
//         },
//       },
//       {
//         $match: {
//           $and: [
//             {
//               $and: [
//                 {
//                   $or: [
//                     {
//                       $and: [
//                         {
//                           "activity.receiverUser": req.body.user,
//                         },
//                         {
//                           "activity.receiverType": {
//                             $nin: [IActivityTypes.like, IActivityTypes.unlike],
//                           },
//                         },
//                       ],
//                     },
//                     {
//                       "activity.receiverUser": {
//                         $ne: req.body.user,
//                       },
//                     },
//                   ],
//                 },
//               ],
//             },
//             // { "activity.senderType": IActivityTypes.like },
//           ],
//         },
//       },
//       {
//         $lookup: {
//           from: "hobbies",
//           localField: "hobby",
//           foreignField: "_id",
//           as: "hobby",
//         },
//       },
//       {
//         $lookup: {
//           from: "preferences",
//           localField: "preferences",
//           foreignField: "_id",
//           as: "preferences",
//         },
//       },

//       {
//         $facet: {
//           match1: [
//             {
//               $match: {
//                 hobby: randomKeyHobby,
//                 // age: { $gte: req.body.minAge, $lte: req.body.maxAge },
//                 // gender: req.body.gender,
//                 // [`hobby.${randomKeyHobby}`]:
//                 //   myHobbies && myHobbies.hobby
//                 //     ? myHobbies.hobby![
//                 //         randomKeyHobby as keyof typeof myHobbies.hobby
//                 //       ]
//                 //     : "",
//               },
//             },
//             // { $limit: 1 },
//           ],
//           match2: [
//             {
//               $match: {
//                 // age: { $gte: req.body.minAge, $lte: req.body.maxAge },
//                 // gender: req.body.gender,
//               },
//             },
//             // { $limit: 1 },
//           ],
//         },
//       },
//       {
//         $project: {
//           result: {
//             $cond: {
//               if: { $gt: [{ $size: "$match1" }, 0] },
//               then: "$match1",
//               else: "$match2",
//             },
//           },
//         },
//       },
//       {
//         $unwind: "$result",
//       },
//       { $limit: 1 },
//     ]);
//     res.json(profiles);
//   } catch (error) {
//     res.json(error);
//   }
// }
