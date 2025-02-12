-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('UNDER_REVIEW', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "status" "ShipmentStatus" NOT NULL DEFAULT 'UNDER_REVIEW';
