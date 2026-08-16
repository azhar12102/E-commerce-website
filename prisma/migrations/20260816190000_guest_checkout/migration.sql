-- Make existing user relation optional
ALTER TABLE "Order"
ALTER COLUMN "userId" DROP NOT NULL;

-- Make the existing foreign-key relationship compatible with guest orders
ALTER TABLE "Order"
DROP CONSTRAINT IF EXISTS "Order_userId_fkey";

ALTER TABLE "Order"
ADD CONSTRAINT "Order_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Add guest customer information
ALTER TABLE "Order"
ADD COLUMN "customerName" TEXT,
ADD COLUMN "customerPhone" TEXT,
ADD COLUMN "customerAddress" TEXT;