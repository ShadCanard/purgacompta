/*
  Warnings:

  - You are about to drop the `contestants` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `event_contestants` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN "notes" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "contestants";
PRAGMA foreign_keys=on;

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
    CONSTRAINT "bets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bets" ("amount", "contestantId", "createdAt", "eventId", "id", "updatedAt") SELECT "amount", "contestantId", "createdAt", "eventId", "id", "updatedAt" FROM "bets";
DROP TABLE "bets";
ALTER TABLE "new_bets" RENAME TO "bets";
CREATE TABLE "new_event_contestants" (
    "eventId" TEXT NOT NULL PRIMARY KEY,
    "contestantId" TEXT NOT NULL,
    CONSTRAINT "event_contestants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_event_contestants" ("contestantId", "eventId") SELECT "contestantId", "eventId" FROM "event_contestants";
DROP TABLE "event_contestants";
ALTER TABLE "new_event_contestants" RENAME TO "event_contestants";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
