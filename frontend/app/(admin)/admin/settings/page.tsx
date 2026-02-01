"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import {
  Heading, Subheading, Button, Input, Container, ContainerHeader, ContainerBody,
} from "@/components/admin/ui";
import { getInitials } from "@/lib/admin/utils";

export default function SettingsPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <Heading>Settings</Heading>
        <Subheading>Manage your admin account</Subheading>
      </div>

      <Container>
        <ContainerHeader>
          <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">Profile</h2>
        </ContainerHeader>
        <ContainerBody>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--admin-tag-purple-bg)] text-lg font-semibold text-[var(--admin-tag-purple-fg)]">
              {user ? getInitials(user.firstName || "A", user.lastName || "D") : "AD"}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--admin-fg-base)]">
                {user ? `${user.firstName} ${user.lastName}` : "Admin User"}
              </p>
              <p className="text-xs text-[var(--admin-fg-muted)]">
                {user?.email || "admin@npccommerce.com"}
              </p>
              <p className="text-xs text-[var(--admin-fg-muted)] capitalize">
                {user?.role?.toLowerCase() || "admin"}
              </p>
            </div>
          </div>
        </ContainerBody>
      </Container>

      <Container>
        <ContainerHeader>
          <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">Change Password</h2>
        </ContainerHeader>
        <ContainerBody className="space-y-4">
          <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={confirmPassword && newPassword !== confirmPassword ? "Passwords do not match" : undefined} />
          <div className="flex justify-end">
            <Button disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}>
              Update Password
            </Button>
          </div>
        </ContainerBody>
      </Container>
    </div>
  );
}
