-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Machine" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Machine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MachinePreset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "voltage" REAL,
    "stroke" REAL,
    "needleConfig" TEXT,
    "cartridgeBrand" TEXT,
    "needleDiameter" REAL,
    "taper" TEXT,
    "technique" TEXT,
    "notes" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MachinePreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MachinePreset_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PresetVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "presetId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "voltage" REAL,
    "stroke" REAL,
    "needleConfig" TEXT,
    "cartridgeBrand" TEXT,
    "needleDiameter" REAL,
    "taper" TEXT,
    "technique" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PresetVersion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PresetVersion_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "MachinePreset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InkProduct" (
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

-- CreateTable
CREATE TABLE "InkBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "inkProductId" TEXT NOT NULL,
    "batchNumber" TEXT,
    "quantity" REAL NOT NULL DEFAULT 0,
    "initialQuantity" REAL NOT NULL DEFAULT 0,
    "purchaseDate" DATETIME,
    "openingDate" DATETIME,
    "expirationDate" DATETIME,
    "price" REAL,
    "supplierId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InkBatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InkBatch_inkProductId_fkey" FOREIGN KEY ("inkProductId") REFERENCES "InkProduct" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InkBatch_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WashCollection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WashCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WashRecipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "collectionId" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "type" TEXT NOT NULL,
    "baseInkBrand" TEXT,
    "baseInkName" TEXT,
    "baseInkId" TEXT,
    "diluentBrand" TEXT,
    "diluentType" TEXT,
    "totalVolume" REAL,
    "inkQuantity" REAL,
    "diluentQuantity" REAL,
    "ratio" TEXT,
    "percentage" REAL,
    "drops" INTEGER,
    "milliliters" REAL,
    "notes" TEXT,
    "imageUrl" TEXT,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WashRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WashRecipe_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "WashCollection" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WashRecipe_baseInkId_fkey" FOREIGN KEY ("baseInkId") REFERENCES "InkProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WashShade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "colorPreview" TEXT,
    "inkPercentage" REAL,
    "diluentPercentage" REAL,
    "inkQuantity" REAL,
    "diluentQuantity" REAL,
    "totalVolume" REAL,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WashShade_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "WashRecipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WashRecipeVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "snapshot" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WashRecipeVersion_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "WashRecipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cartridge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "configuration" TEXT,
    "needleCount" INTEGER,
    "needleDiameter" REAL,
    "taper" TEXT,
    "cartridgeType" TEXT,
    "compatibility" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "initialQuantity" INTEGER NOT NULL DEFAULT 0,
    "minStockLevel" INTEGER NOT NULL DEFAULT 0,
    "purchasePrice" REAL,
    "supplierId" TEXT,
    "imageUrl" TEXT,
    "notes" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cartridge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cartridge_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Consumable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "quantity" REAL NOT NULL DEFAULT 0,
    "unit" TEXT,
    "minStockLevel" REAL NOT NULL DEFAULT 0,
    "price" REAL,
    "supplierId" TEXT,
    "purchaseDate" DATETIME,
    "expirationDate" DATETIME,
    "imageUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Consumable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Consumable_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "contactPerson" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Supplier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemName" TEXT,
    "quantity" REAL NOT NULL,
    "unit" TEXT,
    "price" REAL,
    "supplierId" TEXT,
    "inkProductId" TEXT,
    "cartridgeId" TEXT,
    "consumableId" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StockMovement_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StockMovement_inkProductId_fkey" FOREIGN KEY ("inkProductId") REFERENCES "InkProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StockMovement_cartridgeId_fkey" FOREIGN KEY ("cartridgeId") REFERENCES "Cartridge" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StockMovement_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "Consumable" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TechnicalNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "tags" TEXT,
    "imageUrl" TEXT,
    "machineId" TEXT,
    "presetId" TEXT,
    "cartridgeId" TEXT,
    "recipeId" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TechnicalNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TechnicalNote_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TechnicalNote_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "MachinePreset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TechnicalNote_cartridgeId_fkey" FOREIGN KEY ("cartridgeId") REFERENCES "Cartridge" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TechnicalNote_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "WashRecipe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SessionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "machineId" TEXT,
    "presetId" TEXT,
    "cartridgeInfo" TEXT,
    "inkUsed" TEXT,
    "recipeId" TEXT,
    "notes" TEXT,
    "imageUrls" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SessionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SessionLog_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SessionLog_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "MachinePreset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SessionLog_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "WashRecipe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecentlyUsed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "usedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RecentlyUsed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Machine_userId_idx" ON "Machine"("userId");

-- CreateIndex
CREATE INDEX "MachinePreset_userId_idx" ON "MachinePreset"("userId");

-- CreateIndex
CREATE INDEX "MachinePreset_machineId_idx" ON "MachinePreset"("machineId");

-- CreateIndex
CREATE INDEX "PresetVersion_presetId_idx" ON "PresetVersion"("presetId");

-- CreateIndex
CREATE INDEX "InkProduct_userId_idx" ON "InkProduct"("userId");

-- CreateIndex
CREATE INDEX "InkBatch_inkProductId_idx" ON "InkBatch"("inkProductId");

-- CreateIndex
CREATE INDEX "WashCollection_userId_idx" ON "WashCollection"("userId");

-- CreateIndex
CREATE INDEX "WashRecipe_userId_idx" ON "WashRecipe"("userId");

-- CreateIndex
CREATE INDEX "WashShade_recipeId_idx" ON "WashShade"("recipeId");

-- CreateIndex
CREATE INDEX "WashRecipeVersion_recipeId_idx" ON "WashRecipeVersion"("recipeId");

-- CreateIndex
CREATE INDEX "Cartridge_userId_idx" ON "Cartridge"("userId");

-- CreateIndex
CREATE INDEX "Consumable_userId_idx" ON "Consumable"("userId");

-- CreateIndex
CREATE INDEX "Supplier_userId_idx" ON "Supplier"("userId");

-- CreateIndex
CREATE INDEX "StockMovement_userId_idx" ON "StockMovement"("userId");

-- CreateIndex
CREATE INDEX "StockMovement_itemType_itemId_idx" ON "StockMovement"("itemType", "itemId");

-- CreateIndex
CREATE INDEX "TechnicalNote_userId_idx" ON "TechnicalNote"("userId");

-- CreateIndex
CREATE INDEX "SessionLog_userId_idx" ON "SessionLog"("userId");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_itemType_itemId_key" ON "Favorite"("userId", "itemType", "itemId");

-- CreateIndex
CREATE INDEX "RecentlyUsed_userId_idx" ON "RecentlyUsed"("userId");
