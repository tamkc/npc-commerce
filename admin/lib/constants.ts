export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "NPC Admin";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "npc_admin_access_token",
  REFRESH_TOKEN: "npc_admin_refresh_token",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
} as const;
