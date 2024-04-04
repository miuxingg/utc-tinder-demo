import mongoose from "mongoose";
import Hobbies from "../models/hobbies.model";

export const createHobbies = async (req: any, res: any, next: any) => {
  try {
    const user = req.body.userId;
    const hobbies = await Hobbies.create({
      user,
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

export const updateHobbies = async (req: any, res: any, next: any) => {
  try {
    const user = req.body.userId;
    const hobbies = await Hobbies.findOneAndUpdate(
      { user },
      { ...req.body },
      { new: true, runValidator: true }
    );
    res.status(200).json({
      status: "success",
      data: hobbies,
    });
  } catch (error) {
    res.json(error);
  }
};

export const getHobbiesType = async (req: any, res: any, next: any) => {
  try {
    const uniqueTypes = await Hobbies.aggregate([
      {
        $group: {
          _id: "$type",
        },
      },
      {
        $project: {
          _id: 0, // Loại trừ trường _id khỏi kết quả
          type: "$_id", // Thêm trường 'type' vào kết quả, sao chép giá trị từ '_id'
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: uniqueTypes,
    });
  } catch (error) {
    res.json(error);
  }
};

export const getHobbyNameFromType = async (req: any, res: any, next: any) => {
  try {
    const { type } = req.params;
    const uniqueTypes = await Hobbies.aggregate([
      {
        $match: {
          type: type,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: uniqueTypes,
    });
  } catch (error) {
    res.json(error);
  }
};

export const genarateHobbies = async (req: any, res: any, next: any) => {
  try {
    const arrData = [
      { type: "sport", name: "Bóng rổ" },
      { type: "sport", name: "Bóng đá" },
      { type: "sport", name: "Bóng chuyền" },
      { type: "sport", name: "Tennis" },
      { type: "sport", name: "Chạy bộ" },
      { type: "sport", name: "Bơi" },
      { type: "sport", name: "Cầu lông" },
      { type: "sport", name: "Bóng bầu dục" },
      { type: "sport", name: "Golf" },
      { type: "sport", name: "Không chơi thể thao" },

      { type: "pet", name: "Mèo" },
      { type: "pet", name: "Chó" },
      { type: "pet", name: "Chuột" },
      { type: "pet", name: "Thỏ" },
      { type: "pet", name: "Chuột Hamster" },
      { type: "pet", name: "Chim" },
      { type: "pet", name: "Cá" },
      { type: "pet", name: "Rùa" },
      { type: "pet", name: "Bò sát" },
      { type: "pet", name: "Không nuôi động vật" },

      { type: "drink", name: "Bia" },
      { type: "drink", name: "Rượu" },
      { type: "drink", name: "Nước có gas" },
      { type: "drink", name: "Cocktail" },
      { type: "drink", name: "Coffee" },
      { type: "drink", name: "Trà" },
      { type: "drink", name: "Nước hoa quả" },
      { type: "drink", name: "Sinh tố" },

      { type: "education", name: "Cử nhân" },
      { type: "education", name: "Đang học đại học" },
      { type: "education", name: "Trung học phổ thông" },
      { type: "education", name: "Tiến sĩ" },
      { type: "education", name: "Đang học sau đại học" },
      { type: "education", name: "Trường dạy nghề" },
      { type: "education", name: "Thạc sĩ" },

      { type: "zodiac", name: "Bạch Dương" },
      { type: "zodiac", name: "Kim Ngưu" },
      { type: "zodiac", name: "Song Tử" },
      { type: "zodiac", name: "Cự Giải" },
      { type: "zodiac", name: "Sư Tử" },
      { type: "zodiac", name: "Xử Nữ" },
      { type: "zodiac", name: "Thiên Bình" },
      { type: "zodiac", name: "Thiên Yết" },
      { type: "zodiac", name: "Nhân Mã" },
      { type: "zodiac", name: "Ma Kết" },
      { type: "zodiac", name: "Bảo Bình" },
      { type: "zodiac", name: "Song Ngư" },

      { type: "communication", name: "Thích nhắn tin" },
      { type: "communication", name: "Ít nhắn tin" },
      { type: "communication", name: "Thích gọi điện" },
      { type: "communication", name: "Ít gọi điện" },
      { type: "communication", name: "Thích gọi video" },
      { type: "communication", name: "Ít gọi video" },
      { type: "communication", name: "Thích gặp mặt trực tiếp" },
      { type: "communication", name: "Thích gặp mặt trực tiếp" },

      { type: "things", name: "Hành động tinh tế" },
      { type: "things", name: "Cử chỉ âu yếm" },
      { type: "things", name: "Những lời khen" },
      { type: "things", name: "Những món quà" },
      { type: "things", name: "Thời gian ở bên nhau" },
    ];
    const hobbies = await Hobbies.create(arrData);
    res.status(200).json({
      status: "success",
      data: hobbies,
    });
  } catch (error) {
    res.json(error);
  }
};

export const deleteAllBobbies = async (req: any, res: any, next: any) => {
  try {
    const uniqueTypes = await Hobbies.deleteMany();

    res.status(200).json({
      status: "success",
      data: uniqueTypes,
    });
  } catch (error) {
    res.json(error);
  }
};
