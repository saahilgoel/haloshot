-- Enable Supabase Realtime on generation_jobs so clients can subscribe to
-- status changes instead of polling. The webhook writes row updates; the
-- browser receives them over WebSocket within ~100ms.
--
-- Safe to run multiple times: `IF NOT EXISTS` checks keep it idempotent.
-- If you add new tables to realtime later, repeat the ALTER PUBLICATION line.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'generation_jobs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.generation_jobs;
  END IF;
END
$$;
