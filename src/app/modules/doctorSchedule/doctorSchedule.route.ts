import { Router } from 'express';
import auth from '../../middlewires/auth';
import { UserRole } from '@prisma/client';
import { DoctorScheduleController } from './doctorSchedule.controller';
import { validationRequest } from '../../middlewires/validationRequest';
import { doctorValidation } from './doctorSchedule.validation';

const router = Router();
router.post(
  '/',
  validationRequest(doctorValidation.createDoctorScheduleValidationSchema),
  auth(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorSchedule
);

router.get('/', auth(UserRole.DOCTOR), DoctorScheduleController.getAllDoctorSchedule);

export const DoctorScheduleRouter = router;
