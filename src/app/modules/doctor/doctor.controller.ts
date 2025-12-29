import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { DoctorService } from './doctor.service';
import { sendResponse } from '../../utils/sendResponse';
import pick from '../../utils/pick';
import { doctorFilterableFields } from './doctor.constant';
import { paginationFields } from '../../constant/constant';
import { IPaginationOptions } from '../../utils/pagination/pagination.interface';

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const file = req.file;

  const result = await DoctorService.createDoctor(payload, file);

  sendResponse(res, {
    message: 'Doctor account created successfully',
    data: result,
  });
});

const getAllDoctors = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, doctorFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await DoctorService.getAllDoctors(
    queryOptions,
    paginationOptions as IPaginationOptions
  );
  sendResponse(res, {
    message: 'Doctor data retrieved successfully',
    data: result,
  });
});
const getSingleDoctor = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await DoctorService.getSingleDoctor(id);
  sendResponse(res, {
    message: 'Doctor data retrieved successfully',
    data: result,
  });
});

const updateDoctor = catchAsync(async (req, res) => {
  const userId = req.params?.id;

  const updateData = req.body;

  const result = await DoctorService.updateDoctor(userId, updateData);

  sendResponse(res, {
    message: 'Doctor updated successfully',
    data: result,
  });
});
const getAiSuggestion = catchAsync(async (req, res) => {
  const result = await DoctorService.getAiSuggestion(req.body);

  sendResponse(res, {
    message: 'Doctor updated successfully',
    data: result,
  });
});

const softDeleteDoctor = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await DoctorService.softDeleteDoctor(id);

  sendResponse(res, {
    message: 'Doctor soft deleted successfully',
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await DoctorService.deleteDoctor(id);

  sendResponse(res, {
    message: 'Doctor deleted successfully',
    data: result,
  });
});

export const DoctorContrller = {
  createDoctor,
  getAllDoctors,
  getSingleDoctor,
  updateDoctor,
  getAiSuggestion,
  softDeleteDoctor,
  deleteDoctor,
};
