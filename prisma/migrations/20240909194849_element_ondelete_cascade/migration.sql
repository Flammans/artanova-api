-- DropForeignKey
ALTER TABLE "Element" DROP CONSTRAINT "Element_collectionId_fkey";

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
