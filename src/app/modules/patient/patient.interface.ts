import { Gender } from "@prisma/client";

export interface IPatient {
  email: string;
  name: string;
  contactNumber: string;
  address?: string;
  gender: Gender;
  profilePhoto: string;
}
