-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Machine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "customName" TEXT,
    "type" TEXT,
    "driveSystem" TEXT,
    "strokeMin" REAL,
    "strokeMax" REAL,
    "fixedStroke" BOOLEAN NOT NULL DEFAULT false,
    "weight" REAL,
    "batteryInfo" TEXT,
    "connectionType" TEXT,
    "purchaseDate" DATETIME,
    "price" REAL,
    "serialNumber" TEXT,
    "imageUrl" TEXT,
    "notes" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Machine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Machine" ("batteryInfo", "brand", "connectionType", "createdAt", "customName", "driveSystem", "fixedStroke", "id", "imageUrl", "model", "notes", "price", "purchaseDate", "serialNumber", "strokeMax", "strokeMin", "type", "updatedAt", "userId", "weight") SELECT "batteryInfo", "brand", "connectionType", "createdAt", "customName", "driveSystem", "fixedStroke", "id", "imageUrl", "model", "notes", "price", "purchaseDate", "serialNumber", "strokeMax", "strokeMin", "type", "updatedAt", "userId", "weight" FROM "Machine";
DROP TABLE "Machine";
ALTER TABLE "new_Machine" RENAME TO "Machine";
CREATE INDEX "Machine_userId_idx" ON "Machine"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
