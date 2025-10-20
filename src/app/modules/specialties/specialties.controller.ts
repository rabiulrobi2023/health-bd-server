import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SpecialtiesService } from "./specialities.service";

const createSpecialties = catchAsync(async (req, res) => {
  const payload = req.body;
  const file = req.file;
  const result = await SpecialtiesService.createSpecialties(payload, file);
  sendResponse(res, {
    message: "Specialties created successfully",
    data: result,
  });
});
const getAllSpecialties = catchAsync(async (req, res) => {
  const result = await SpecialtiesService.getAllSpecialties();
  sendResponse(res, {
    message: "Specialties retrived successfully",
    data: result,
  });
});
const deleteSpecialties = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await SpecialtiesService.deleteSpecialties(id);
  sendResponse(res, {
    message: "Specialties deleted successfully",
    data: result,
  });
});

export const SpecialtiesController = {
  createSpecialties,
  getAllSpecialties,
  deleteSpecialties,
};
