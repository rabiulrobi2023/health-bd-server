import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = ["PORT", "NODE_ENV"];

const envVars = () => {
  requiredEnvVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable ${envVar}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
  };
};

export const envVariable = envVars();
