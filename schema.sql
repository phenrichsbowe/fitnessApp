-- Create the exercises table (template/catalog of exercises)
CREATE TABLE exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    muscle_groups TEXT[] DEFAULT '{}',
    description TEXT,
    is_custom BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(name, user_id)
);

-- Create the workouts table
CREATE TABLE workouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, date)
);

-- Create the workout_exercises table (junction table with exercise details)
CREATE TABLE workout_exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES exercises(id) ON DELETE RESTRICT NOT NULL,
    sets INTEGER NOT NULL DEFAULT 3,
    reps INTEGER NOT NULL DEFAULT 10,
    weight NUMERIC,
    time_per_set INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user settings table
CREATE TABLE user_settings (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    is_metric BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_date ON workouts(date);
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);

-- RLS Policies for exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public exercises"
    ON exercises FOR SELECT
    USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can insert their own exercises"
    ON exercises FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercises"
    ON exercises FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercises"
    ON exercises FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for workouts
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workouts"
    ON workouts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
    ON workouts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
    ON workouts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
    ON workouts FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for workout_exercises
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout exercises"
    ON workout_exercises FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own workout exercises"
    ON workout_exercises FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own workout exercises"
    ON workout_exercises FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own workout exercises"
    ON workout_exercises FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

-- RLS Policies for user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
    ON user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON user_settings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Insert default global exercises
INSERT INTO exercises (name, category, muscle_groups, description, is_custom, user_id)
VALUES 
    ('Bench Press', 'Chest', ARRAY['Chest', 'Shoulders', 'Triceps'], 'A compound exercise targeting the chest muscles', false, NULL),
    ('Squats', 'Legs', ARRAY['Quadriceps', 'Hamstrings', 'Glutes'], 'A fundamental lower body exercise', false, NULL),
    ('Deadlifts', 'Back', ARRAY['Lower Back', 'Hamstrings', 'Glutes'], 'A compound exercise for the posterior chain', false, NULL),
    ('Pull-ups', 'Back', ARRAY['Upper Back', 'Biceps', 'Shoulders'], 'An upper body pulling exercise', false, NULL),
    ('Push-ups', 'Chest', ARRAY['Chest', 'Shoulders', 'Triceps'], 'A bodyweight pushing exercise', false, NULL),
    ('Shoulder Press', 'Shoulders', ARRAY['Shoulders', 'Triceps'], 'An overhead pressing movement', false, NULL),
    ('Bicep Curls', 'Arms', ARRAY['Biceps'], 'An isolation exercise for the biceps', false, NULL),
    ('Tricep Extensions', 'Arms', ARRAY['Triceps'], 'An isolation exercise for the triceps', false, NULL),
    ('Plank', 'Core', ARRAY['Core', 'Abs'], 'A static core strengthening exercise', false, NULL),
    ('Russian Twists', 'Core', ARRAY['Obliques', 'Abs'], 'A rotational core exercise', false, NULL)
ON CONFLICT (name, user_id) 
DO UPDATE SET 
    category = EXCLUDED.category,
    muscle_groups = EXCLUDED.muscle_groups,
    description = EXCLUDED.description; 