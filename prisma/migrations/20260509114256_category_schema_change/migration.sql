-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories"("name");
