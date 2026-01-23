-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_item_prices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "onSell" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "item_prices_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "item_prices_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_item_prices" ("createdAt", "groupId", "id", "itemId", "price", "updatedAt") SELECT "createdAt", "groupId", "id", "itemId", "price", "updatedAt" FROM "item_prices";
DROP TABLE "item_prices";
ALTER TABLE "new_item_prices" RENAME TO "item_prices";
CREATE UNIQUE INDEX "item_prices_itemId_groupId_key" ON "item_prices"("itemId", "groupId");
CREATE TABLE "new_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sellable" BOOLEAN NOT NULL DEFAULT true,
    "weapon" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_items" ("createdAt", "id", "name", "updatedAt", "weight") SELECT "createdAt", "id", "name", "updatedAt", "weight" FROM "items";
DROP TABLE "items";
ALTER TABLE "new_items" RENAME TO "items";
CREATE UNIQUE INDEX "items_name_key" ON "items"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
