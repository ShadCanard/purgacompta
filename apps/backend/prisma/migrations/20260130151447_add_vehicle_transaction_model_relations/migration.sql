-- CreateTable
CREATE TABLE "vehicle_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "rewardAmount" REAL NOT NULL,
    "isMoney" BOOLEAN NOT NULL,
    "isDirtyMoney" BOOLEAN NOT NULL,
    "itemId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vehicle_transactions_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vehicle_transactions_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
