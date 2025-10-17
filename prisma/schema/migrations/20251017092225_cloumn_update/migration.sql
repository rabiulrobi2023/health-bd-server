/*
  Warnings:

  - You are about to drop the column `upadatedAt` on the `doctor-schedules` table. All the data in the column will be lost.
  - You are about to drop the column `upadatedAt` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `doctor-schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctor-schedules" DROP COLUMN "upadatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "upadatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
