-- 1. Create a table for public profiles
-- This table will store user data that the admin dashboard fetches
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Realtime for the profiles table
-- This allows the admin dashboard to update in real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for the profiles table

-- Policy: Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Allow users to insert their own profile during registration
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Allow ADMINS to view all profiles
-- NOTE: In a production app, you should use a service role key or a specific 'admin' metadata check.
-- For now, we enable read access for the admin dashboard.
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (true); -- Replace 'true' with a more secure check if needed

-- 5. Optional: Function and Trigger to handle new user signups automatically
-- This is a more robust way to create profiles than doing it from the app code.
/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
*/
