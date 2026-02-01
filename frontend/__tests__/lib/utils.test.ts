import { describe, it, expect } from "vitest";
import { cn, formatPrice, truncate, slugify } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("merges conflicting tailwind classes", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});

describe("formatPrice", () => {
  it("formats cents to USD currency string", () => {
    expect(formatPrice(1999)).toBe("$19.99");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  it("formats large amounts", () => {
    expect(formatPrice(100000)).toBe("$1,000.00");
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("Hello World", 5)).toBe("Hello...");
  });

  it("returns short strings unchanged", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
  });
});

describe("slugify", () => {
  it("converts to lowercase slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World?")).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    expect(slugify("foo   bar")).toBe("foo-bar");
  });
});
