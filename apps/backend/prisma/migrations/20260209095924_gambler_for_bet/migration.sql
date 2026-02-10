/*
  Warnings:

  - Added the required column `gamblerId` to the `bets` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    "gamblerId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bets" ("amount", "contestantId", "createdAt", "eventId", "id", "updatedAt") SELECT "amount", "contestantId", "createdAt", "eventId", "id", "updatedAt" FROM "bets";
DROP TABLE "bets";
ALTER TABLE "new_bets" RENAME TO "bets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
