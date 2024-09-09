/*
  Warnings:

  - You are about to drop the `_ArtworkToCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArtworkToCollection" DROP CONSTRAINT "_ArtworkToCollection_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtworkToCollection" DROP CONSTRAINT "_ArtworkToCollection_B_fkey";

-- DropTable
DROP TABLE "_ArtworkToCollection";

-- CreateTable
CREATE TABLE "Element" (
    "id" VARCHAR(30) NOT NULL,
    "collectionId" VARCHAR(30) NOT NULL,
    "artworkId" VARCHAR NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
