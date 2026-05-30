-- AlterTable
ALTER TABLE "entities" ADD COLUMN     "category_id" BIGINT;

-- CreateIndex
CREATE INDEX "entities_category_id_idx" ON "entities"("category_id");

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
