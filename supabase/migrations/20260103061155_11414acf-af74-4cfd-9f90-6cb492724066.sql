-- Add price column to services table
ALTER TABLE public.services 
ADD COLUMN price DECIMAL(10,2) DEFAULT 0;

-- Update existing service with a default price
UPDATE public.services SET price = 500.00 WHERE price IS NULL OR price = 0;