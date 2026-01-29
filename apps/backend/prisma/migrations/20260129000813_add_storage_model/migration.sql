-- CreateTable
CREATE TABLE "storages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "maxWeight" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "storage_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storageId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "storage_items_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "storages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "storage_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "storages_name_key" ON "storages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "storage_items_storageId_itemId_key" ON "storage_items"("storageId", "itemId");
