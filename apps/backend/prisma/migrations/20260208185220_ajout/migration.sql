/*
  Warnings:

  - You are about to drop the column `gamblerId` on the `bets` table. All the data in the column will be lost.
  - Added the required column `contestantId` to the `bets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "contestants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "car" TEXT,
    "pilot" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "contestants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bets_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "contestants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bets" ("amount", "createdAt", "eventId", "id", "updatedAt") SELECT "amount", "createdAt", "eventId", "id", "updatedAt" FROM "bets";
DROP TABLE "bets";
ALTER TABLE "new_bets" RENAME TO "bets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
