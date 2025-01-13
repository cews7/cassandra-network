/*
  Warnings:

  - You are about to drop the column `content` on the `Prediction` table. All the data in the column will be lost.
  - You are about to drop the column `expectedDate` on the `Prediction` table. All the data in the column will be lost.
  - The `status` column on the `Prediction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `text` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeframe` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TimeFrame" AS ENUM ('IMMEDIATE', 'NEAR', 'MEDIUM', 'LONG');

-- CreateEnum
CREATE TYPE "PredictionStatus" AS ENUM ('ACTIVE', 'VALIDATED', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PATTERN_EMERGING', 'PREDICTION_VALIDATED', 'HIGH_QUALITY_ANALYSIS', 'CRITICAL_SIGNAL');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SEER');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('STRONG_SIGNAL', 'WEAK_SIGNAL', 'NEEDS_EVIDENCE');

-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "content",
DROP COLUMN "expectedDate",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "elasticSearchId" TEXT,
ADD COLUMN     "evidence" TEXT,
ADD COLUMN     "patternId" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "searchableText" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "timeframe" "TimeFrame" NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "validatedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "PredictionStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" TEXT,
    "providerId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'SEER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalPredictions" INTEGER NOT NULL DEFAULT 0,
    "correctPredictions" INTEGER NOT NULL DEFAULT 0,
    "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "insightScore" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "predictionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "type" "VoteType" NOT NULL,
    "reasoning" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "predictionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "timeframe" "TimeFrame" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "searchableText" TEXT,
    "elasticSearchId" TEXT,
    "categoryId" TEXT,
    "totalPredictions" INTEGER NOT NULL DEFAULT 0,
    "validatedPredictions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Comment_predictionId_idx" ON "Comment"("predictionId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_predictionId_key" ON "Vote"("userId", "predictionId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pattern_name_key" ON "Pattern"("name");

-- CreateIndex
CREATE INDEX "Pattern_timeframe_isActive_idx" ON "Pattern"("timeframe", "isActive");

-- CreateIndex
CREATE INDEX "Pattern_categoryId_idx" ON "Pattern"("categoryId");

-- CreateIndex
CREATE INDEX "Prediction_status_timeframe_idx" ON "Prediction"("status", "timeframe");

-- CreateIndex
CREATE INDEX "Prediction_categoryId_idx" ON "Prediction"("categoryId");

-- CreateIndex
CREATE INDEX "Prediction_userId_idx" ON "Prediction"("userId");

-- CreateIndex
CREATE INDEX "Prediction_patternId_idx" ON "Prediction"("patternId");

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "Pattern"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "Prediction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "Prediction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pattern" ADD CONSTRAINT "Pattern_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
