-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InkProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "colorName" TEXT NOT NULL,
    "colorCode" TEXT,
    "category" TEXT,
    "bottleVolume" REAL,
    "currentQuantity" REAL NOT NULL DEFAULT 0,
    "initialQuantity" REAL NOT NULL DEFAULT 0,
    "minStockLevel" REAL NOT NULL DEFAULT 0,
    "purchaseDate" DATETIME,
    "openingDate" DATETIME,
    "expirationDate" DATETIME,
    "batchNumber" TEXT,
    "supplierId" TEXT,
    "price" REAL,
    "imageUrl" TEXT,
    "notes" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InkProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InkProduct_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InkProduct" ("batchNumber", "bottleVolume", "brand", "category", "colorCode", "colorName", "createdAt", "currentQuantity", "expirationDate", "favorite", "id", "imageUrl", "initialQuantity", "notes", "openingDate", "price", "productName", "purchaseDate", "supplierId", "updatedAt", "userId") SELECT "batchNumber", "bottleVolume", "brand", "category", "colorCode", "colorName", "createdAt", "currentQuantity", "expirationDate", "favorite", "id", "imageUrl", "initialQuantity", "notes", "openingDate", "price", "productName", "purchaseDate", "supplierId", "updatedAt", "userId" FROM "InkProduct";
DROP TABLE "InkProduct";
ALTER TABLE "new_InkProduct" RENAME TO "InkProduct";
CREATE INDEX "InkProduct_userId_idx" ON "InkProduct"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
