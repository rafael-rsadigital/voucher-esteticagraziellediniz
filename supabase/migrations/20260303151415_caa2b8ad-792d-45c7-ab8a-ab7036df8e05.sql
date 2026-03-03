
-- Create vouchers table
CREATE TABLE public.vouchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Enable RLS
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Public can read vouchers by code (for the public voucher page)
CREATE POLICY "Anyone can view vouchers by code"
ON public.vouchers
FOR SELECT
USING (true);

-- Only authenticated users can insert vouchers (admin)
CREATE POLICY "Authenticated users can create vouchers"
ON public.vouchers
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated users can delete vouchers
CREATE POLICY "Authenticated users can delete vouchers"
ON public.vouchers
FOR DELETE
TO authenticated
USING (true);
