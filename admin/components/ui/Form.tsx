"use client";

import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
} from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormProps<T extends FieldValues>
  extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

function FormRoot<T extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}

interface FieldContextValue {
  name: string;
  id: string;
}

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext() {
  const ctx = useContext(FieldContext);
  if (!ctx) throw new Error("Form.Field descendants must be used within Form.Field");
  return ctx;
}

interface FieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  render: ControllerProps<TFieldValues, TName>["render"];
}

function Field<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, ...props }: FieldProps<TFieldValues, TName>) {
  const id = useId();
  return (
    <FieldContext.Provider value={{ name, id }}>
      <Controller name={name} {...props} />
    </FieldContext.Provider>
  );
}

function Item({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("space-y-1.5", className)} {...props} />;
}

function Label({ className, ...props }: ComponentPropsWithoutRef<"label">) {
  const { id } = useFieldContext();
  return (
    <label
      htmlFor={id}
      className={cn("text-xs font-medium text-[var(--admin-fg-subtle)]", className)}
      {...props}
    />
  );
}

function Control({ children }: { children: React.ReactElement }) {
  return <>{children}</>;
}

function Hint({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn("text-xs text-[var(--admin-fg-muted)]", className)} {...props} />
  );
}

function ErrorMessage({
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"p">, "children">) {
  const { name } = useFieldContext();
  const { formState: { errors } } = useFormContext();
  const error = errors[name];
  if (!error?.message) return null;

  return (
    <p
      className={cn("text-xs text-[var(--admin-fg-error)]", className)}
      role="alert"
      {...props}
    >
      {String(error.message)}
    </p>
  );
}

export const Form = Object.assign(FormRoot, {
  Field,
  Item,
  Label,
  Control,
  Hint,
  ErrorMessage,
});
