/*
  Warnings:

  - A unique constraint covering the columns `[storageLocationId]` on the table `storages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "storages_storageLocationId_key" ON "storages"("storageLocationId");
