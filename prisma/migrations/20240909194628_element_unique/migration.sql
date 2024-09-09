/*
  Warnings:

  - A unique constraint covering the columns `[collectionId,artworkId]` on the table `Element` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Element_collectionId_artworkId_key" ON "Element"("collectionId", "artworkId");
