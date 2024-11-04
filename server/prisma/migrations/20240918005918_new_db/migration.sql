/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,eventId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('CANCELLED', 'ONGOING', 'UPCOMING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "status",
ADD COLUMN     "status" "EventStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- CreateIndex
CREATE INDEX "Event_creatorId_idx" ON "Event"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_userId_eventId_key" ON "Reservation"("userId", "eventId");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
