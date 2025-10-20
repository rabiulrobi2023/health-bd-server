import { Doctor, Gender } from "@prisma/client";

export interface IDoctor {
  email: string;
  name: string;
  contactNumber: string;
  address?: string;
  gender: Gender;
  profilePhoto?: string;
  qualification: string;
  registrationNumber: string;
  experience: number;
  currentWorkingPlace: string;
  designation: string;
  appoinmentFee: number;
}

export interface IDoctorUpdate extends Doctor {
  doctorSpecialties: {
    specialtiesId: string;
    isDeleted?: boolean;
  }[];
}


