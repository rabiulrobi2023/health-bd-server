import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { DoctorScheduleService } from './doctorSchedule.Service';

const createDoctorSchedule = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await DoctorScheduleService.createDoctorSchedule(user, payload);
  sendResponse(res, {
    message: 'Doctor schedule created successfully',
    data: result,
  });
});
const getAllDoctorSchedule = catchAsync(async (req, res) => {
  const result = await DoctorScheduleService.getAllDoctorSchedule();
  sendResponse(res, {
    message: 'Doctor schedule retrieved successfully',
    data: result,
  });
});

export const DoctorScheduleController = {
  createDoctorSchedule,
  getAllDoctorSchedule,
};
