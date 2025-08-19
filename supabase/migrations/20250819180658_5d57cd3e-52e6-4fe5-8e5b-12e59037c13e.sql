-- Create wellness_points table for tracking user wellness scores
CREATE TABLE public.wellness_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL, -- 'chat_analysis', 'mood_entry', 'manual'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wellness_points ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own wellness points" 
ON public.wellness_points 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wellness points" 
ON public.wellness_points 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_wellness_points_user_id ON public.wellness_points(user_id);
CREATE INDEX idx_wellness_points_created_at ON public.wellness_points(created_at);