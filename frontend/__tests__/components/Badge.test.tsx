import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge).toHaveClass("bg-zinc-100");
  });

  it("applies success variant styles", () => {
    render(<Badge variant="success">In stock</Badge>);
    const badge = screen.getByText("In stock");
    expect(badge).toHaveClass("bg-green-100");
  });

  it("applies danger variant styles", () => {
    render(<Badge variant="danger">Sale</Badge>);
    const badge = screen.getByText("Sale");
    expect(badge).toHaveClass("bg-red-100");
  });

  it("applies custom className", () => {
    render(<Badge className="mt-4">Custom</Badge>);
    const badge = screen.getByText("Custom");
    expect(badge).toHaveClass("mt-4");
  });
});
