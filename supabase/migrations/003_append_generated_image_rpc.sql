-- Atomic append for generated_image_urls to kill the read-modify-write race
-- that clobbered concurrent webhook writes. Two predictions finishing within
-- the same second were both reading `[]` and writing `[imgA]` / `[imgB]`,
-- losing one image.
--
-- The function locks the row with SELECT ... FOR UPDATE, appends to both
-- arrays, recomputes total vs. done, and returns the updated row. Webhook
-- callers use supabase.rpc('append_generated_image', {...}) instead of
-- doing the read-then-update themselves.

CREATE OR REPLACE FUNCTION public.append_generated_image(
  p_job_id UUID,
  p_url TEXT,
  p_similarity NUMERIC DEFAULT 0.85,
  p_processing_time_ms INTEGER DEFAULT NULL,
  p_cost_per_image NUMERIC DEFAULT 0.003
) RETURNS public.generation_jobs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job public.generation_jobs;
  v_total INTEGER;
  v_new_count INTEGER;
  v_all_done BOOLEAN;
BEGIN
  -- Row-level lock: serializes concurrent webhook writes on the same job.
  SELECT * INTO v_job
  FROM public.generation_jobs
  WHERE id = p_job_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job % not found', p_job_id;
  END IF;

  v_total := COALESCE(
    array_length(string_to_array(v_job.replicate_prediction_id, ','), 1),
    1
  );
  v_new_count := COALESCE(array_length(v_job.generated_image_urls, 1), 0) + 1;
  v_all_done := v_new_count >= v_total;

  UPDATE public.generation_jobs
  SET
    generated_image_urls = COALESCE(generated_image_urls, ARRAY[]::TEXT[]) || p_url,
    similarity_scores = COALESCE(similarity_scores, ARRAY[]::NUMERIC[]) || p_similarity,
    cost_usd = COALESCE(cost_usd, 0) + p_cost_per_image,
    status = CASE WHEN v_all_done THEN 'completed' ELSE 'processing' END,
    completed_at = CASE WHEN v_all_done THEN NOW() ELSE completed_at END,
    processing_time_ms = COALESCE(p_processing_time_ms, processing_time_ms)
  WHERE id = p_job_id
  RETURNING * INTO v_job;

  RETURN v_job;
END;
$$;

-- Allow the service role (used by our webhook) to call this function.
GRANT EXECUTE ON FUNCTION public.append_generated_image TO service_role;
