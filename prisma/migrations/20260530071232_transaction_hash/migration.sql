/*
  Warnings:

  - A unique constraint covering the columns `[user_id,transaction_hash]` on the table `raw_transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_hash` to the `raw_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "raw_transactions" ADD COLUMN     "transaction_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "raw_transactions_user_id_transaction_hash_key" ON "raw_transactions"("user_id", "transaction_hash");
