/*
  Warnings:

  - You are about to drop the column `billOfLadingCount` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `commercialInvoice` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `packingList` on the `Shipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "billOfLadingCount",
DROP COLUMN "commercialInvoice",
DROP COLUMN "packingList",
ADD COLUMN     "billOfLadingFiles" TEXT[],
ADD COLUMN     "commercialInvoiceFile" TEXT,
ADD COLUMN     "packingListFile" TEXT;
