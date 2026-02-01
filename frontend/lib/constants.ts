export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "NPC Commerce";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "npc_access_token",
  REFRESH_TOKEN: "npc_refresh_token",
  CART_ID: "npc_cart_id",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
} as const;
