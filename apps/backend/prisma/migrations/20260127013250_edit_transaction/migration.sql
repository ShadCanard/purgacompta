/*
  Warnings:

  - You are about to drop the column `userId` on the `transactions` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT,
    "targetId" TEXT,
    "blanchimentPercent" INTEGER NOT NULL,
    "amountToBring" REAL NOT NULL,
    "blanchimentAmount" REAL NOT NULL,
    "totalFinal" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_transactions" ("amountToBring", "blanchimentAmount", "blanchimentPercent", "createdAt", "id", "sourceId", "targetId", "totalFinal") SELECT "amountToBring", "blanchimentAmount", "blanchimentPercent", "createdAt", "id", "sourceId", "targetId", "totalFinal" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
