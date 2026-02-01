-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_storage_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storageId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "minQuantity" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "storage_items_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "storages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "storage_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_storage_items" ("id", "itemId", "quantity", "storageId") SELECT "id", "itemId", "quantity", "storageId" FROM "storage_items";
DROP TABLE "storage_items";
ALTER TABLE "new_storage_items" RENAME TO "storage_items";
CREATE UNIQUE INDEX "storage_items_storageId_itemId_key" ON "storage_items"("storageId", "itemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
