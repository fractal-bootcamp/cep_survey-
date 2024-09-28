/*
  Warnings:

  - Added the required column `value` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'MULTIPLE_CHOICE', 'SCALE', 'YES_NO');

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "options" TEXT,
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "QuestionType" NOT NULL;

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
