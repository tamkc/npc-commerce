import { apiClient } from "./api-client";
import type { Product, ApiResponse } from "@/types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

export interface RecommendationGroup {
  title: string;
  products: Product[];
}

export interface SearchSuggestion {
  text: string;
  score: number;
}

export const aiClient = {
  chat: (message: string, context?: { page?: string; cartItemCount?: number }) =>
    apiClient.post<ApiResponse<ChatMessage>>("/ai/chat", { message, context }),

  getRecommendations: (params?: { userId?: string; productId?: string }) =>
    apiClient.get<ApiResponse<RecommendationGroup[]>>(
      "/ai/recommendations",
      params as Record<string, string>,
    ),

  semanticSearch: (query: string) =>
    apiClient.get<ApiResponse<{ products: Product[]; suggestions: SearchSuggestion[] }>>(
      "/ai/search",
      { q: query },
    ),
};
