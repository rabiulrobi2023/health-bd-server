/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import cloudinary from "../../config/cloudinary.cofig";

export const uploadToCloudinary = async (file: Express.Multer.File) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      public_id: file.filename,
    });

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || "Cloudinary upload failed"
    );
  }
};
