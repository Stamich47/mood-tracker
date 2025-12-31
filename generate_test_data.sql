-- SQL function to generate dummy test mood tracker data for the test user
-- Run this to update the function (drops and recreates it)

DROP FUNCTION IF EXISTS generate_test_data();

CREATE OR REPLACE FUNCTION generate_test_data()
RETURNS int AS $$
DECLARE
  test_user_id uuid := '0434251e-7bb4-4509-a45b-e1579c99edd4';
  inserted_count int;
BEGIN
  RAISE NOTICE 'Starting data generation for user %', test_user_id;

  -- Insert dummy data for each day in 2025
  INSERT INTO public.daily_logs (user_id, date, mood, worked_out, drinks)
  SELECT
    test_user_id,
    d::date,
    (random() * 4 + 1)::int,  -- mood 1-5
    random() > 0.5,            -- worked_out random true/false
    (random() * 5)::int        -- drinks 0-5
  FROM generate_series('2025-01-01'::date, '2025-12-31'::date, '1 day'::interval) d
  ON CONFLICT (user_id, date) DO NOTHING;  -- Avoid duplicates

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RAISE NOTICE 'Inserted % rows for user %', inserted_count, test_user_id;
  RETURN inserted_count;
END;
$$ LANGUAGE plpgsql;

-- To use: Run the above, then SELECT generate_test_data();