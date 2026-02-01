import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { API_BASE_URL } from "@/lib/constants";

async function forwardHeaders(): Promise<Record<string, string>> {
  const headersList = await headers();
  const forwarded: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const auth = headersList.get("authorization");
  if (auth) forwarded["Authorization"] = auth;
  return forwarded;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cartId: string }> },
) {
  const { cartId } = await params;
  const fwd = await forwardHeaders();

  const response = await fetch(`${API_BASE_URL}/store/cart/${cartId}`, {
    headers: fwd,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
