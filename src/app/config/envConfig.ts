import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "NODE_ENV",
  "BCRIPT_SALT_ROUND",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_SECRET",
  "JWT_ACCESS_SECRET",
  "JWT_ACCESS_EXPIRE",
  "JWT_REFRESH_SECRET",
  "JWT_REFRESH_EXPIRE",
  "OPEN_ROUTER_API_KEY",
] as const;

// const envVars = () => {
//   requiredEnvVariables.forEach((envVar) => {
//     if (!process.env[envVar]) {
//       throw new Error(`Missing required environment variable ${envVar}`);
//     }
//   });
//   return {
//     PORT: process.env.PORT as string,
//     NODE_ENV: process.env.NODE_ENV as string,
//     BCRIPT_SALT_ROUND: process.env.BCRIPT_SALT_ROUND as string,
//     CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
//     CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
//     CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET as string,
//     JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
//     JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE,
//     JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
//     JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE,
//   };
// };

//Alternative

const envVars = () => {
  requiredEnvVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable ${envVar}`);
    }
  });
  return Object.fromEntries(
    requiredEnvVariables.map((key) => [key, process.env[key] as string])
  ) as Record<(typeof requiredEnvVariables)[number], string>;
};

export const envVariable = envVars();
