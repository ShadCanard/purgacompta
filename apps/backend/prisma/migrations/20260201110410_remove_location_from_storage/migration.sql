/*
  Warnings:

  - You are about to drop the column `location` on the `storages` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_storages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "maxWeight" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "storageLocationId" TEXT,
    CONSTRAINT "storages_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "storage_locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_storages" ("createdAt", "id", "maxWeight", "name", "storageLocationId", "type", "updatedAt") SELECT "createdAt", "id", "maxWeight", "name", "storageLocationId", "type", "updatedAt" FROM "storages";
DROP TABLE "storages";
ALTER TABLE "new_storages" RENAME TO "storages";
CREATE UNIQUE INDEX "storages_name_key" ON "storages"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
