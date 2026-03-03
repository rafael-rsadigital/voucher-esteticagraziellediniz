
-- Create admin_users table
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin_users
CREATE POLICY "Admins can view admin_users"
ON public.admin_users FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Security definer function to check admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = _user_id
  )
$$;

-- Drop old permissive policies
DROP POLICY "Authenticated users can delete vouchers" ON public.vouchers;
DROP POLICY "Authenticated users can create vouchers" ON public.vouchers;

-- Restrict INSERT and DELETE to admins only
CREATE POLICY "Only admins can create vouchers"
ON public.vouchers FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete vouchers"
ON public.vouchers FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));
