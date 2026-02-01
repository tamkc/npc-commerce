import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick handler", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled").closest("button")).toBeDisabled();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByText("Loading").closest("button")).toBeDisabled();
  });

  it("shows spinner when loading", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByText("Loading").closest("button");
    const svg = button?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies variant styles", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText("Outline").closest("button");
    expect(button).toHaveClass("border");
  });

  it("applies size styles", () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByText("Large").closest("button");
    expect(button).toHaveClass("h-12");
  });
});
