import { Router } from 'express';
import { DoctorContrller } from './doctor.controller';
import { validationRequest } from '../../middlewires/validationRequest';
import { DoctorValidation } from './doctor.validation';
import { upload } from '../../utils/fileUpload/multer';
import auth from '../../middlewires/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/create',
  auth(UserRole.ADMIN),
  upload.single('file'),
  validationRequest(DoctorValidation.createDoctorValidationSchema),
  DoctorContrller.createDoctor
);

router.get('/', DoctorContrller.getAllDoctors);
router.get('/:id', DoctorContrller.getSingleDoctor);
router.patch(
  '/:id',
  auth(UserRole.DOCTOR, UserRole.ADMIN),
  upload.single('file'),
  validationRequest(DoctorValidation.updateDoctorSchema),
  DoctorContrller.updateDoctor
);
router.post('/suggestion', DoctorContrller.getAiSuggestion);
router.delete('/soft-delete/:id', auth(UserRole.ADMIN), DoctorContrller.softDeleteDoctor);
router.delete('/:id', auth(UserRole.ADMIN), DoctorContrller.deleteDoctor);

export const DoctorRoutes = router;
