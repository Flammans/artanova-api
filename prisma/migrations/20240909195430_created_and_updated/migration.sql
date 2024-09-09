/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "createdAt";
