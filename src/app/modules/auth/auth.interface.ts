import { UserRole } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

export interface IJwtPayload extends JwtPayload {
  email: string;
  role: UserRole;
}

export interface ILogin {
  email: string;
  password: string;
}
