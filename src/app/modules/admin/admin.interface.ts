import { Gender } from "@prisma/client";

export interface IAdmin {
  email: string;
  name: string;
  contactNumber: string;
  address?: string;
  gender: Gender;
  profilePhoto?: string;
}
