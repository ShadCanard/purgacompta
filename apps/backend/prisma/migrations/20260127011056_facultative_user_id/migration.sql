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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "groups" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "groups" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "contacts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("amountToBring", "blanchimentAmount", "blanchimentPercent", "createdAt", "id", "sourceId", "targetId", "totalFinal", "userId") SELECT "amountToBring", "blanchimentAmount", "blanchimentPercent", "createdAt", "id", "sourceId", "targetId", "totalFinal", "userId" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
