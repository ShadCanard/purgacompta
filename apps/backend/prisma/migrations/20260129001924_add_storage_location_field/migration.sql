/*
  Warnings:

  - Added the required column `location` to the `storages` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_storages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "maxWeight" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_storages" ("createdAt", "id", "maxWeight", "name", "type", "updatedAt") SELECT "createdAt", "id", "maxWeight", "name", "type", "updatedAt" FROM "storages";
DROP TABLE "storages";
ALTER TABLE "new_storages" RENAME TO "storages";
CREATE UNIQUE INDEX "storages_name_key" ON "storages"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
