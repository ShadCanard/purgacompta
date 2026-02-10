/*
  Warnings:

  - The primary key for the `event_contestants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `event_contestants` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_event_contestants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "event_contestants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_event_contestants" ("contestantId", "eventId", "notes") SELECT "contestantId", "eventId", "notes" FROM "event_contestants";
DROP TABLE "event_contestants";
ALTER TABLE "new_event_contestants" RENAME TO "event_contestants";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
