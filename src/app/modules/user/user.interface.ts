import { Gender } from "@prisma/client";

export interface IUser {
  email: string;
  name: string;
  password: string;
  contactNumber: string;
  gender: Gender;
  profilePhoto: string;
}
