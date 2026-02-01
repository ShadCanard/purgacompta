-- CreateTable
CREATE TABLE "storage_locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

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
    "updatedAt" DATETIME NOT NULL,
    "storageLocationId" TEXT,
    CONSTRAINT "storages_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "storage_locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_storages" ("createdAt", "id", "location", "maxWeight", "name", "type", "updatedAt") SELECT "createdAt", "id", "location", "maxWeight", "name", "type", "updatedAt" FROM "storages";
DROP TABLE "storages";
ALTER TABLE "new_storages" RENAME TO "storages";
CREATE UNIQUE INDEX "storages_name_key" ON "storages"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "storage_locations_name_key" ON "storage_locations"("name");
