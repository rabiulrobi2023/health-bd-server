import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { validationRequest } from '../../middlewires/validationRequest';

const router = Router();

router.post(
  '/login',
  validationRequest(AuthValidation.authValidationSchema),
  AuthController.credentialLogin
);

router.get('/me', AuthController.getMe);

export const AuthRoutes = router;
