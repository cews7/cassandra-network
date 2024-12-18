/*
  Warnings:

  - You are about to drop the column `submittedBy` on the `Prediction` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Validation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Prediction" DROP CONSTRAINT "Prediction_submittedBy_fkey";

-- DropForeignKey
ALTER TABLE "Validation" DROP CONSTRAINT "Validation_predictionId_fkey";

-- DropForeignKey
ALTER TABLE "Validation" DROP CONSTRAINT "Validation_validatedBy_fkey";

-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "submittedBy";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Validation";
