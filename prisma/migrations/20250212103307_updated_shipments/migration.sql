/*
  Warnings:

  - You are about to drop the column `destination` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDelivery` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Shipment` table. All the data in the column will be lost.
  - Added the required column `billOfLadingCount` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientEmail` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commercialInvoice` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `containers20ft` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `containers40ft` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packingList` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_userId_fkey";

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "destination",
DROP COLUMN "estimatedDelivery",
DROP COLUMN "origin",
DROP COLUMN "status",
DROP COLUMN "userId",
DROP COLUMN "weight",
ADD COLUMN     "billOfLadingCount" INTEGER NOT NULL,
ADD COLUMN     "clientEmail" TEXT NOT NULL,
ADD COLUMN     "commercialInvoice" BOOLEAN NOT NULL,
ADD COLUMN     "containers20ft" INTEGER NOT NULL,
ADD COLUMN     "containers40ft" INTEGER NOT NULL,
ADD COLUMN     "packingList" BOOLEAN NOT NULL;
