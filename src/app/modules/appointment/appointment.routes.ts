import { Router } from 'express';
import auth from '../../middlewires/auth';
import { UserRole } from '@prisma/client';
import { validationRequest } from '../../middlewires/validationRequest';
import { AppointmentValidation } from './appointment.validation';
import { AppointmentController } from './appointment.controller';

const router = Router();
router.post(
  '/',
  auth(UserRole.PATIENT),
  validationRequest(AppointmentValidation.createAppointmentValidation),
  AppointmentController.createAppointment
);
router.get('/me', auth(UserRole.PATIENT, UserRole.DOCTOR), AppointmentController.getMyAppointment);
router.get('/', auth(UserRole.ADMIN), AppointmentController.getAllAppointment);
router.patch(
  '/status/:id',
  auth(UserRole.DOCTOR, UserRole.PATIENT),
  validationRequest(AppointmentValidation.updateStatusValidation),
  AppointmentController.updateAppointment
);

export const AppointmentRouter = router;
