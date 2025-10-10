import multer from "multer";
import path from "path";
import { getRandomNumByDate } from "../getRandomNumByDate";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/upload"));
  },
  filename: function (req, file, cb) {
    const originalFileName = file.originalname;
    const lengthOfExtension = originalFileName.split(".").pop()
      ?.length as number;

    const fileNameWithoutExtension = originalFileName.substring(
      0,
      originalFileName?.length - (lengthOfExtension + 1)
    );

    const fileName = fileNameWithoutExtension
      .toLocaleLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/\./g, "_");

    const randomNum = getRandomNumByDate();
    cb(null, randomNum + "-" + fileName);
  },
});

export const upload = multer({ storage: storage });
