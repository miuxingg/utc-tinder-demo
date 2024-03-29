import mongoose from "mongoose";
import Profile from "../models/profile.model";
import { IActivityTypes } from "../interfaces/activity.interface";
import Activity from "../models/activity.model";
import Preferences from "../models/preferences.model";
import { IPreferences } from "../interfaces/preferences.interface";

export const createProfile = async (req: any, res: any, next: any) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);

    const profile = await Profile.create({
      user: userId,
      hobby: req.body.hobby.map(
        (hobbyId: string) => new mongoose.Types.ObjectId(hobbyId)
      ),
      title: req.body.title,
      description: req.body.description,
      photos: req.body.photos,
      age: req.body.age,
      gender: req.body.gender,
      adress: req.body.adress,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(req.body.longitude),
          parseFloat(req.body.latitude),
        ],
      },
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
    const user = req.userId;
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

//khi người dùng quẹt trái, phải ứng dụng sẽ cập nhật trạng thái thích hay không thích
export const updateActivity = async (req: any, res: any, next: any) => {
  try {
    if (req.body.isCreate === "true") {
      const updateActivity = await Activity.findOneAndUpdate(
        {
          $and: [
            { senderUser: req.body.senderUser },
            { receiverUser: req.body.receiverUser },
          ],
        },
        { receiverType: req.body.receiverType },
        { new: true, runValidator: true }
      );

      res.status(200).json({
        status: "success",
        data: updateActivity,
      });
    } else {
      const newActivity = await Activity.create({
        senderUser: req.body.senderUser,
        senderType: req.body.senderType,
        receiverUser: req.body.receiverUser,
      });
      const updateActivity = await Profile.findOneAndUpdate(
        { user: req.body.senderUser },
        {
          $addToSet: { activity: newActivity._id },
        },
        { new: true }
      );
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

    console.log(
      "here",
      myProfile[0]?.preferences ? myProfile[0]?.preferences.distance : 10000
    );
    const radius = myProfile[0]?.preferences
      ? myProfile[0]?.preferences.distance
      : 10000; // 5km radius
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
    console.log(randomKeyHobby);

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
          _id: { $nin: req.body.arrId },
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
                      "activity.receiverUser": {
                        $ne: req.userId,
                      },
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
        $project: {
          "hobby._id": 1,
          "hobby.name": 1,
          user: 1,
          // activity: 1,
          title: 1,
          description: 1,
          age: 1,
          gender: 1,
          address: 1,
          location: 1,
          preferences: 1,
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
    res.json(profiles);
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
    console.log("user", req.userId);

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

    console.log(
      "here",
      myProfile[0]?.preferences ? myProfile[0]?.preferences.distance : 10000
    );
    const radius = myProfile[0]?.preferences
      ? myProfile[0]?.preferences.distance
      : 10000; // 5km radius
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
    console.log(randomKeyHobby);

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
                      "activity.receiverUser": {
                        $ne: req.userId,
                      },
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
        $project: {
          "hobby._id": 1,
          "hobby.name": 1,
          user: 1,
          // activity: 1,
          title: 1,
          description: 1,
          age: 1,
          gender: 1,
          address: 1,
          location: 1,
          preferences: 1,
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
      { $limit: 10 },
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
