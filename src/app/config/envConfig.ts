import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "NODE_ENV",
  "BCRIPT_SALT_ROUND",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_SECRET",
];

const envVars = () => {
  requiredEnvVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable ${envVar}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    BCRIPT_SALT_ROUND: process.env.BCRIPT_SALT_ROUND as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET as string,
  };
};

export const envVariable = envVars();
