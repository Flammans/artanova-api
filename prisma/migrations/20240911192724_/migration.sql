/*
  Warnings:

  - You are about to drop the column `creditLine` on the `Artwork` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Artwork" DROP COLUMN "creditLine",
ADD COLUMN     "artist" VARCHAR;
