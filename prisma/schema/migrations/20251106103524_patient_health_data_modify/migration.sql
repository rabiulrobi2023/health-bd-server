/*
  Warnings:

  - You are about to drop the column `gender` on the `patientHealths` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."appointments_id_key";

-- DropIndex
DROP INDEX "public"."payments_id_key";

-- DropIndex
DROP INDEX "public"."prescriptions_id_key";

-- DropIndex
DROP INDEX "public"."reviews_id_key";

-- AlterTable
ALTER TABLE "patientHealths" DROP COLUMN "gender";
