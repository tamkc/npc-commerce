"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Button, Input } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/admin");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--admin-bg-interactive)]">
            <span className="text-sm font-bold text-white">N</span>
          </div>
          <h1 className="text-lg font-semibold text-[var(--admin-fg-base)]">
            Sign in to NPC Admin
          </h1>
          <p className="mt-1 text-sm text-[var(--admin-fg-muted)]">
            Enter your admin credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@npccommerce.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-xs text-[var(--admin-fg-error)]">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={loading}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
