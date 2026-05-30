-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_user_id_fkey";

-- DropForeignKey
ALTER TABLE "entities" DROP CONSTRAINT "entities_user_id_fkey";

-- DropForeignKey
ALTER TABLE "raw_transactions" DROP CONSTRAINT "raw_transactions_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "raw_transactions" DROP CONSTRAINT "raw_transactions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "statement_uploads" DROP CONSTRAINT "statement_uploads_user_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_annotations" DROP CONSTRAINT "transaction_annotations_category_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_annotations" DROP CONSTRAINT "transaction_annotations_entity_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_annotations" DROP CONSTRAINT "transaction_annotations_raw_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_annotations" DROP CONSTRAINT "transaction_annotations_user_id_fkey";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" BIGINT,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "entities" DROP CONSTRAINT "entities_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" BIGINT NOT NULL,
ADD CONSTRAINT "entities_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "raw_transactions" DROP CONSTRAINT "raw_transactions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
DROP COLUMN "upload_id",
ADD COLUMN     "upload_id" BIGINT NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" BIGINT NOT NULL,
ADD CONSTRAINT "raw_transactions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "statement_uploads" DROP CONSTRAINT "statement_uploads_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" BIGINT NOT NULL,
ADD CONSTRAINT "statement_uploads_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "transaction_annotations" DROP CONSTRAINT "transaction_annotations_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
DROP COLUMN "raw_transaction_id",
ADD COLUMN     "raw_transaction_id" BIGINT NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" BIGINT NOT NULL,
DROP COLUMN "category_id",
ADD COLUMN     "category_id" BIGINT,
DROP COLUMN "entity_id",
ADD COLUMN     "entity_id" BIGINT,
ADD CONSTRAINT "transaction_annotations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "categories_user_id_idx" ON "categories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_user_id_name_key" ON "categories"("user_id", "name");

-- CreateIndex
CREATE INDEX "entities_user_id_idx" ON "entities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "entities_user_id_name_key" ON "entities"("user_id", "name");

-- CreateIndex
CREATE INDEX "raw_transactions_user_id_txn_date_idx" ON "raw_transactions"("user_id", "txn_date");

-- CreateIndex
CREATE INDEX "raw_transactions_user_id_txn_type_idx" ON "raw_transactions"("user_id", "txn_type");

-- CreateIndex
CREATE UNIQUE INDEX "raw_transactions_upload_id_source_row_index_key" ON "raw_transactions"("upload_id", "source_row_index");

-- CreateIndex
CREATE INDEX "statement_uploads_user_id_uploaded_at_idx" ON "statement_uploads"("user_id", "uploaded_at");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_annotations_raw_transaction_id_key" ON "transaction_annotations"("raw_transaction_id");

-- CreateIndex
CREATE INDEX "transaction_annotations_user_id_idx" ON "transaction_annotations"("user_id");

-- CreateIndex
CREATE INDEX "transaction_annotations_category_id_idx" ON "transaction_annotations"("category_id");

-- CreateIndex
CREATE INDEX "transaction_annotations_entity_id_idx" ON "transaction_annotations"("entity_id");

-- AddForeignKey
ALTER TABLE "statement_uploads" ADD CONSTRAINT "statement_uploads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_transactions" ADD CONSTRAINT "raw_transactions_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "statement_uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_transactions" ADD CONSTRAINT "raw_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_annotations" ADD CONSTRAINT "transaction_annotations_raw_transaction_id_fkey" FOREIGN KEY ("raw_transaction_id") REFERENCES "raw_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_annotations" ADD CONSTRAINT "transaction_annotations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_annotations" ADD CONSTRAINT "transaction_annotations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_annotations" ADD CONSTRAINT "transaction_annotations_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
