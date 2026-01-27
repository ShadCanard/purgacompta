-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vehicle_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT,
    "userId" TEXT NOT NULL,
    "found" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "vehicle_users_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "vehicle_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_vehicle_users" ("found", "id", "userId", "vehicleId") SELECT "found", "id", "userId", "vehicleId" FROM "vehicle_users";
DROP TABLE "vehicle_users";
ALTER TABLE "new_vehicle_users" RENAME TO "vehicle_users";
CREATE UNIQUE INDEX "vehicle_users_vehicleId_userId_key" ON "vehicle_users"("vehicleId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
