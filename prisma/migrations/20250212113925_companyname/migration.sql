/*
  Warnings:

  - You are about to drop the column `clientEmail` on the `Shipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "clientEmail",
ADD COLUMN     "clientName" TEXT NOT NULL DEFAULT 'Unknown Company';
