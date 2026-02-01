"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  defaultValues?: Partial<ShippingFormData>;
  isLoading?: boolean;
}

export function ShippingForm({
  onSubmit,
  defaultValues,
  isLoading,
}: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    defaultValues: {
      country: "US",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Shipping Address
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="firstName"
          label="First name"
          error={errors.firstName?.message}
          {...register("firstName", { required: "First name is required" })}
        />
        <Input
          id="lastName"
          label="Last name"
          error={errors.lastName?.message}
          {...register("lastName", { required: "Last name is required" })}
        />
      </div>

      <Input
        id="addressLine1"
        label="Address"
        placeholder="Street address"
        error={errors.addressLine1?.message}
        {...register("addressLine1", { required: "Address is required" })}
      />

      <Input
        id="addressLine2"
        label="Apartment, suite, etc. (optional)"
        {...register("addressLine2")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          id="city"
          label="City"
          error={errors.city?.message}
          {...register("city", { required: "City is required" })}
        />
        <Input
          id="state"
          label="State"
          error={errors.state?.message}
          {...register("state", { required: "State is required" })}
        />
        <Input
          id="postalCode"
          label="Postal code"
          error={errors.postalCode?.message}
          {...register("postalCode", { required: "Postal code is required" })}
        />
      </div>

      <Input
        id="country"
        label="Country"
        error={errors.country?.message}
        {...register("country", { required: "Country is required" })}
      />

      <Input
        id="phone"
        label="Phone (optional)"
        type="tel"
        {...register("phone")}
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Continue to Payment
      </Button>
    </form>
  );
}
