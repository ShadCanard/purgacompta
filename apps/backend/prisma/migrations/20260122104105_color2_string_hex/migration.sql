-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "description" TEXT,
    "color1" TEXT,
    "color2" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_groups" ("color1", "color2", "createdAt", "description", "id", "isActive", "name", "tag", "updatedAt") SELECT "color1", "color2", "createdAt", "description", "id", "isActive", "name", "tag", "updatedAt" FROM "groups";
DROP TABLE "groups";
ALTER TABLE "new_groups" RENAME TO "groups";
CREATE UNIQUE INDEX "groups_name_key" ON "groups"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
