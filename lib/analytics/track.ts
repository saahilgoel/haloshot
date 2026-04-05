import { createAdminClient } from "../supabase/admin";
import type { AnalyticsEvent } from "./events";

interface TrackOptions {
  userId?: string;
  sessionId?: string;
  properties?: Record<string, unknown>;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
}

/**
 * Universal tracking function.
 * Logs events to both PostHog (if configured) and the Supabase analytics_events table.
 */
export async function track(
  eventName: AnalyticsEvent | string,
  options: TrackOptions = {}
) {
  const { userId, sessionId, properties, pageUrl, referrer, userAgent } =
    options;

  // 1. Log to Supabase analytics_events table
  try {
    const supabase = createAdminClient();
    await supabase.from("analytics_events").insert({
      user_id: userId || null,
      session_id: sessionId || null,
      event_name: eventName,
      event_properties: properties || {},
      page_url: pageUrl || null,
      referrer: referrer || null,
      user_agent: userAgent || null,
    });
  } catch (error) {
    console.error("[analytics] Failed to log event to Supabase:", error);
  }

  // 2. Forward to PostHog if configured
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.POSTHOG_HOST) {
    try {
      await fetch(`${process.env.POSTHOG_HOST}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
          event: eventName,
          distinct_id: userId || sessionId || "anonymous",
          properties: {
            ...properties,
            $current_url: pageUrl,
            $referrer: referrer,
          },
        }),
      });
    } catch (error) {
      console.error("[analytics] Failed to log event to PostHog:", error);
    }
  }
}
