ALTER TABLE "receipts"
  ALTER COLUMN "amount" TYPE double precision
  USING "amount"::double precision;
