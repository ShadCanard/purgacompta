-- CreateTable
CREATE TABLE "vehicle_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "found" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "vehicle_users_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vehicle_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_users_vehicleId_userId_key" ON "vehicle_users"("vehicleId", "userId");
