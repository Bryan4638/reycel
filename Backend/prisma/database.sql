-- Creación de tipos enumerados
CREATE TYPE "Role" AS ENUM ('MODERATOR', 'OWNER');
CREATE TYPE "TransactionType" AS ENUM ('ENTRY', 'SALE');
CREATE TYPE "PaymentOptions" AS ENUM ('TRANSFER_USD', 'TRANSFER_CUP', 'CASH', 'QVAPAY', 'ZELLE');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE "NotificationType" AS ENUM ('PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'REGISTER_SUCCESS');
CREATE TYPE "LogAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'SOFT_DELETE');

-- Tabla BaseUser
CREATE TABLE "BaseUser" (
  "id" UUID PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "image" TEXT,
  "status" BOOLEAN NOT NULL DEFAULT false,
  "isDeleted" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Tabla Category
CREATE TABLE "Category" (
  "id" UUID PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "profitsBySell" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Tabla Sede
CREATE TABLE "Sede" (
  "id" UUID PRIMARY KEY,
  "image" TEXT NOT NULL,
  "phone" INTEGER NOT NULL UNIQUE,
  "direction" TEXT NOT NULL,
  "rent" INTEGER NOT NULL,
  "finalLosses" INTEGER NOT NULL DEFAULT 0,
  "netProfits" INTEGER NOT NULL DEFAULT 0
);

-- Tabla Product
CREATE TABLE "Product" (
  "id" UUID PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "categoryId" UUID NOT NULL,
  "investments" INTEGER,
  "imagen" TEXT,
  "color" TEXT,
  "ram" INTEGER,
  "storage" INTEGER,
  "battery" INTEGER,
  "mpxCameraFront" INTEGER,
  "mpxCameraBack" INTEGER,
  "ratingAverage" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "inventoryCount" INTEGER NOT NULL DEFAULT 1,
  "sedeId" UUID,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("sedeId") REFERENCES "Sede" ("id") ON DELETE SET NULL
);

-- Tabla Administrator
CREATE TABLE "Administrator" (
  "id" UUID PRIMARY KEY,
  "baseUserId" UUID NOT NULL UNIQUE,
  "salary" INTEGER,
  "mouthSalary" INTEGER NOT NULL DEFAULT 0,
  "role" "Role" NOT NULL DEFAULT 'MODERATOR',
  "sedeId" UUID,
  FOREIGN KEY ("baseUserId") REFERENCES "BaseUser" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("sedeId") REFERENCES "Sede" ("id") ON DELETE SET NULL
);

-- Tabla Client
CREATE TABLE "Client" (
  "id" UUID PRIMARY KEY,
  "baseUserId" UUID NOT NULL UNIQUE,
  FOREIGN KEY ("baseUserId") REFERENCES "BaseUser" ("id") ON DELETE CASCADE
);

-- Tabla Order
CREATE TABLE "Order" (
  "id" SERIAL PRIMARY KEY,
  "pending" BOOLEAN NOT NULL DEFAULT true,
  "clientId" UUID,
  "adminId" UUID,
  "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL,
  FOREIGN KEY ("adminId") REFERENCES "Administrator" ("id") ON DELETE SET NULL
);

-- Tabla OrderItem
CREATE TABLE "OrderItem" (
  "id" UUID PRIMARY KEY,
  "orderId" INTEGER NOT NULL,
  "productId" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE
);

-- Tabla PaymentMethod
CREATE TABLE "PaymentMethod" (
  "id" UUID PRIMARY KEY,
  "cardImage" TEXT NOT NULL,
  "cardNumber" TEXT,
  "phoneNumber" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paymentOptions" "PaymentOptions" NOT NULL
);

-- Tabla Payment
CREATE TABLE "Payment" (
  "id" SERIAL PRIMARY KEY,
  "orderId" INTEGER NOT NULL UNIQUE,
  "amount" DOUBLE PRECISION NOT NULL,
  "transactionID" TEXT,
  "fastDelivery" BOOLEAN NOT NULL,
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paymentMethodId" UUID NOT NULL,
  "userId" UUID,
  "adminId" UUID,
  FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod" ("id"),
  FOREIGN KEY ("userId") REFERENCES "Client" ("id"),
  FOREIGN KEY ("adminId") REFERENCES "Administrator" ("id")
);

-- Tabla Comment
CREATE TABLE "Comment" (
  "id" UUID PRIMARY KEY,
  "content" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  "productId" UUID NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "Client" ("id") ON DELETE NO ACTION
);

-- Tabla Rating
CREATE TABLE "Rating" (
  "id" UUID PRIMARY KEY,
  "value" INTEGER NOT NULL DEFAULT 1,
  "productID" UUID NOT NULL,
  "clientId" UUID,
  "administratorId" UUID,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("productID") REFERENCES "Product" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE NO ACTION,
  FOREIGN KEY ("administratorId") REFERENCES "Administrator" ("id") ON DELETE NO ACTION
);

-- Tabla InventoryTransaction
CREATE TABLE "InventoryTransaction" (
  "id" UUID PRIMARY KEY,
  "productId" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "transactionType" "TransactionType" NOT NULL,
  "date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("productId") REFERENCES "Product" ("id")
);

-- Tabla Investments_Losses
CREATE TABLE "Investments_Losses" (
  "id" UUID PRIMARY KEY,
  "price" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateAt" TIMESTAMP NOT NULL,
  "sedeId" UUID,
  FOREIGN KEY ("sedeId") REFERENCES "Sede" ("id") ON DELETE CASCADE
);

-- Tabla CurrencyExchange
CREATE TABLE "CurrencyExchange" (
  "id" UUID PRIMARY KEY,
  "cup" DOUBLE PRECISION NOT NULL,
  "eur" DOUBLE PRECISION NOT NULL,
  "cad" DOUBLE PRECISION NOT NULL,
  "gbp" DOUBLE PRECISION NOT NULL,
  "zelle" DOUBLE PRECISION NOT NULL,
  "cupTransfer" DOUBLE PRECISION NOT NULL,
  "mlcTransfer" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Tabla Notification
CREATE TABLE "Notification" (
  "id" UUID PRIMARY KEY,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "type" "NotificationType" NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  "clientId" UUID,
  "administratorId" UUID,
  FOREIGN KEY ("clientId") REFERENCES "Client" ("id"),
  FOREIGN KEY ("administratorId") REFERENCES "Administrator" ("id")
);

-- Tabla TempInventoryReservation
CREATE TABLE "TempInventoryReservation" (
  "id" UUID PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "orderId" INTEGER NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para TempInventoryReservation
CREATE INDEX ON "TempInventoryReservation" ("userId", "orderId");

-- Tabla AuditLog
CREATE TABLE "AuditLog" (
  "id" UUID PRIMARY KEY,
  "action" "LogAction" NOT NULL,
  "model" TEXT NOT NULL,
  "recordId" TEXT NOT NULL,
  "oldData" JSONB,
  "newData" JSONB,
  "changedBy" TEXT,
  "changedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT
);

-- Creación de triggers para updatedAt
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_baseuser_timestamp
BEFORE UPDATE ON "BaseUser"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_category_timestamp
BEFORE UPDATE ON "Category"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_timestamp
BEFORE UPDATE ON "Product"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_comment_timestamp
BEFORE UPDATE ON "Comment"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_investments_losses_timestamp
BEFORE UPDATE ON "Investments_Losses"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_currencyexchange_timestamp
BEFORE UPDATE ON "CurrencyExchange"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_notification_timestamp
BEFORE UPDATE ON "Notification"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();