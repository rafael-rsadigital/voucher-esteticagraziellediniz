ALTER TABLE public.vouchers
  ADD COLUMN IF NOT EXISTS message text,
  ADD COLUMN IF NOT EXISTS highlight_message text,
  ADD COLUMN IF NOT EXISTS service_description text;