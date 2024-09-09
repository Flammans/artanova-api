/*
  Warnings:

  - The primary key for the `Collection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Collection` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `B` on the `_ArtworkToCollection` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.

*/
-- DropForeignKey
ALTER TABLE "_ArtworkToCollection" DROP CONSTRAINT "_ArtworkToCollection_B_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(30),
ADD CONSTRAINT "Collection_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_ArtworkToCollection" ALTER COLUMN "B" SET DATA TYPE VARCHAR(30);

-- AddForeignKey
ALTER TABLE "_ArtworkToCollection" ADD CONSTRAINT "_ArtworkToCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
