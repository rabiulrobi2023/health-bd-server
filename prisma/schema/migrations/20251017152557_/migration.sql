/*
  Warnings:

  - The primary key for the `doctor-schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `scchdhleId` on the `doctor-schedules` table. All the data in the column will be lost.
  - Added the required column `scheduleId` to the `doctor-schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."doctor-schedules" DROP CONSTRAINT "doctor-schedules_scchdhleId_fkey";

-- AlterTable
ALTER TABLE "doctor-schedules" DROP CONSTRAINT "doctor-schedules_pkey",
DROP COLUMN "scchdhleId",
ADD COLUMN     "scheduleId" TEXT NOT NULL,
ADD CONSTRAINT "doctor-schedules_pkey" PRIMARY KEY ("doctorId", "scheduleId");

-- AddForeignKey
ALTER TABLE "doctor-schedules" ADD CONSTRAINT "doctor-schedules_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
