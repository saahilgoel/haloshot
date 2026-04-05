export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "signup_completed",
  UPLOAD_STARTED: "upload_started",
  UPLOAD_COMPLETED: "upload_completed",
  GENERATION_STARTED: "generation_started",
  GENERATION_COMPLETED: "generation_completed",
  DOWNLOAD: "download",
  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_CANCELED: "subscription_canceled",
  REFERRAL_SHARED: "referral_shared",
  REFERRAL_CLICKED: "referral_clicked",
  REFERRAL_CONVERTED: "referral_converted",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
