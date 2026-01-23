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
    "buying" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "item_prices_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "item_prices_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_item_prices" ("createdAt", "groupId", "id", "itemId", "onSell", "price", "updatedAt") SELECT "createdAt", "groupId", "id", "itemId", "onSell", "price", "updatedAt" FROM "item_prices";
DROP TABLE "item_prices";
ALTER TABLE "new_item_prices" RENAME TO "item_prices";
CREATE UNIQUE INDEX "item_prices_itemId_groupId_key" ON "item_prices"("itemId", "groupId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
