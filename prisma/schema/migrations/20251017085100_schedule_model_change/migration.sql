/*
  Warnings:

  - You are about to drop the column `ceatedAt` on the `doctor-schedules` table. All the data in the column will be lost.
  - You are about to drop the column `ceatedAt` on the `schedules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor-schedules" DROP COLUMN "ceatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "ceatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
