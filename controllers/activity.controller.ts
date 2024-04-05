import Activity from "../models/activity.model";

export const createActivity = async (req: any, res: any, next: any) => {
  try {
    const activity = await Activity.create({
      senderUser: req.body.senderUser,
      senderType: req.body.senderType,
      receiverUser: req.body.receiverUser,
      receiverType: req.body.receiverType,
    });

    res.status(200).json({
      status: "success",
      data: activity,
    });
  } catch (error) {
    res.json(error);
  }
};

// export const updateActivity = async (req: any, res: any, next: any) => {
//   try {
//     const user = req.body.userId;
//     const activity = await Activity.findOneAndUpdate(
//       { user },
//       { ...req.body },
//       { new: true, runValidator: true }
//     );
//     res.status(200).json({
//       status: "success",
//       data: activity,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// };

export const deleteAllActivity = async (req: any, res: any, next: any) => {
  try {
    const deleteAllActivity = await Activity.deleteMany();

    res.status(200).json({
      status: "success",
      data: deleteAllActivity,
    });
  } catch (error) {
    res.json(error);
  }
};
