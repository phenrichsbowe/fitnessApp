-- Create food_entries table
CREATE TABLE food_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
    food_name VARCHAR(255) NOT NULL,
    calories INTEGER,
    protein NUMERIC(5,1),
    carbs NUMERIC(5,1),
    fats NUMERIC(5,1),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_food_entries_user_id ON food_entries(user_id);
CREATE INDEX idx_food_entries_date ON food_entries(date);
CREATE INDEX idx_food_entries_meal_type ON food_entries(meal_type);

-- Enable RLS
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own food entries"
    ON food_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food entries"
    ON food_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food entries"
    ON food_entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food entries"
    ON food_entries FOR DELETE
    USING (auth.uid() = user_id); 