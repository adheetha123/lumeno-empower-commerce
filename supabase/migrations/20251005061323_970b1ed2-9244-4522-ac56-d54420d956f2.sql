-- Add seller customization fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS banner_url text,
ADD COLUMN IF NOT EXISTS store_name text,
ADD COLUMN IF NOT EXISTS store_description text,
ADD COLUMN IF NOT EXISTS theme_color text DEFAULT '#8B4513',
ADD COLUMN IF NOT EXISTS is_seller boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS seller_rating numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0;

-- Create seller_follows table
CREATE TABLE IF NOT EXISTS public.seller_follows (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  follower_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(follower_id, seller_id)
);

ALTER TABLE public.seller_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view follows"
  ON public.seller_follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow sellers"
  ON public.seller_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow sellers"
  ON public.seller_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  images text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for their orders"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  provider_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_date timestamp with time zone NOT NULL,
  duration_hours integer DEFAULT 1,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = provider_id);

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can update bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = provider_id);

-- Add tracking fields to orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS tracking_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS tracking_notes text,
ADD COLUMN IF NOT EXISTS estimated_delivery timestamp with time zone,
ADD COLUMN IF NOT EXISTS delivered_at timestamp with time zone;

-- Create function to update seller rating
CREATE OR REPLACE FUNCTION public.update_seller_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    seller_rating = (
      SELECT AVG(rating)
      FROM public.reviews
      WHERE seller_id = NEW.seller_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE seller_id = NEW.seller_id
    )
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$;

-- Trigger to update seller rating on new review
CREATE TRIGGER update_seller_rating_trigger
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW
WHEN (NEW.seller_id IS NOT NULL)
EXECUTE FUNCTION public.update_seller_rating();

-- Add updated_at trigger for new tables
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();