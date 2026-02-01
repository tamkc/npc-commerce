import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/use-debounce";

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("debounces value changes", async () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } },
    );

    expect(result.current).toBe("hello");

    rerender({ value: "world" });
    expect(result.current).toBe("hello");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("world");

    vi.useRealTimers();
  });

  it("cancels previous timeout on rapid changes", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "ab" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: "abc" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("abc");

    vi.useRealTimers();
  });
});
