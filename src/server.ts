/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server } from "http";
import app from "./app";
import { envVariable } from "./app/config/envConfig";

let server: Server;

const startServer = async () => {
  try {
    //Connect your Database here

    server = app.listen(envVariable.PORT, () => {
      console.log(`Server app is running on port ${envVariable.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();

//===================Unhandle Rejection Error Handling================
process.on("unhandledRejection", (err) => {
  console.log("❌Unhandle rejection detected.");
  console.log("Server is shutting down...");
  console.log(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//===================Uncaught Error Handling================
process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught exception detected");
  console.log("Server is shutting down...");
  console.log(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//===================SIGTERM Error Handling================
process.on("SIGTERM", (err) => {
  console.log("❌ SIGTERM signal received");
  console.log("Server is shutting down...");
  console.log(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//===================SIGINT Error Handling================
process.on("SIGINT", (err) => {
  console.log("❌ SIGINT signal received");
  console.log("Server is shutting down...");
  console.log(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
