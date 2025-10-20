/*
  Warnings:

  - The primary key for the `doctor-specialties` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `speacialitiesId` on the `doctor-specialties` table. All the data in the column will be lost.
  - You are about to drop the `Specialties` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `specialtiesId` to the `doctor-specialties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."doctor-specialties" DROP CONSTRAINT "doctor-specialties_speacialitiesId_fkey";

-- AlterTable
ALTER TABLE "doctor-specialties" DROP CONSTRAINT "doctor-specialties_pkey",
DROP COLUMN "speacialitiesId",
ADD COLUMN     "specialtiesId" TEXT NOT NULL,
ADD CONSTRAINT "doctor-specialties_pkey" PRIMARY KEY ("specialtiesId", "doctorId");

-- DropTable
DROP TABLE "public"."Specialties";

-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doctor-specialties" ADD CONSTRAINT "doctor-specialties_specialtiesId_fkey" FOREIGN KEY ("specialtiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
