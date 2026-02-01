"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  Container,
  ContainerHeader,
  ContainerBody,
} from "@/components/admin/ui";
import { useCreatePromotion } from "@/hooks/admin/use-admin-promotions";
import { ArrowLeft } from "lucide-react";
import type { PromotionType } from "@/types/admin";

export default function CreatePromotionPage() {
  const router = useRouter();
  const createPromotion = useCreatePromotion();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PromotionType>("PERCENTAGE");
  const [value, setValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPromotion.mutateAsync({
      name,
      code: code || undefined,
      description: description || undefined,
      type,
      value: Number(value),
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
      isAutomatic,
      isActive,
      startsAt: startsAt || undefined,
      endsAt: endsAt || undefined,
    });
    router.push("/admin/promotions");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-1.5 text-[var(--admin-fg-muted)] transition-colors hover:bg-[var(--admin-bg-field-hover)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Heading>Create Promotion</Heading>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">General</h2>
          </ContainerHeader>
          <ContainerBody className="space-y-4">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SUMMER2024" hint="Leave empty for automatic promotions" />
            <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </ContainerBody>
        </Container>

        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">Discount</h2>
          </ContainerHeader>
          <ContainerBody className="space-y-4">
            <Select label="Type" options={[
              { value: "PERCENTAGE", label: "Percentage" },
              { value: "FIXED", label: "Fixed Amount" },
              { value: "FREE_SHIPPING", label: "Free Shipping" },
              { value: "BUY_X_GET_Y", label: "Buy X Get Y" },
            ]} value={type} onChange={(e) => setType(e.target.value as PromotionType)} />
            <Input label="Value" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder={type === "PERCENTAGE" ? "10" : "5.00"} hint={type === "PERCENTAGE" ? "Percentage off" : "Fixed amount"} required />
            <Input label="Min Order Amount" type="number" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} placeholder="Optional" />
            <Input label="Usage Limit" type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="Unlimited" />
          </ContainerBody>
        </Container>

        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">Schedule & Status</h2>
          </ContainerHeader>
          <ContainerBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
              <Input label="End Date" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
            </div>
            <Switch checked={isAutomatic} onChange={setIsAutomatic} label="Automatic" description="Automatically apply when conditions are met" />
            <Switch checked={isActive} onChange={setIsActive} label="Active" description="Enable this promotion" />
          </ContainerBody>
        </Container>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" isLoading={createPromotion.isPending}>Create Promotion</Button>
        </div>
      </form>
    </div>
  );
}
