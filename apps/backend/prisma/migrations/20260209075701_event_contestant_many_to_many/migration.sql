/*
  Warnings:

  - You are about to drop the column `eventId` on the `contestants` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "event_contestants" (
    "eventId" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,

    PRIMARY KEY ("eventId", "contestantId"),
    CONSTRAINT "event_contestants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "event_contestants_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "contestants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_contestants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "car" TEXT,
    "pilot" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_contestants" ("car", "color", "createdAt", "id", "name", "pilot", "updatedAt") SELECT "car", "color", "createdAt", "id", "name", "pilot", "updatedAt" FROM "contestants";
DROP TABLE "contestants";
ALTER TABLE "new_contestants" RENAME TO "contestants";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
