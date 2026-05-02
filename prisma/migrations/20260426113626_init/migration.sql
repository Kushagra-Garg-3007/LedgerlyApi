-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "UploadFileType" AS ENUM ('CSV', 'XLS', 'XLSX');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statement_uploads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" "UploadFileType" NOT NULL,
    "upload_status" "UploadStatus" NOT NULL DEFAULT 'PENDING',
    "parse_error" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statement_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_transactions" (
    "id" TEXT NOT NULL,
    "upload_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "txn_date" DATE NOT NULL,
    "description_raw" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "txn_type" "TransactionType" NOT NULL,
    "source_row_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_annotations" (
    "id" TEXT NOT NULL,
    "raw_transaction_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT,
    "entity_id" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_annotations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "statement_uploads_user_id_uploaded_at_idx" ON "statement_uploads"("user_id", "uploaded_at");

-- CreateIndex
CREATE INDEX "raw_transactions_user_id_txn_date_idx" ON "raw_transactions"("user_id", "txn_date");

-- CreateIndex
CREATE INDEX "raw_transactions_user_id_txn_type_idx" ON "raw_transactions"("user_id", "txn_type");

-- CreateIndex
CREATE UNIQUE INDEX "raw_transactions_upload_id_source_row_index_key" ON "raw_transactions"("upload_id", "source_row_index");

-- CreateIndex
CREATE INDEX "categories_user_id_idx" ON "categories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_user_id_name_key" ON "categories"("user_id", "name");

-- CreateIndex
CREATE INDEX "entities_user_id_idx" ON "entities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "entities_user_id_name_key" ON "entities"("user_id", "name");

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
