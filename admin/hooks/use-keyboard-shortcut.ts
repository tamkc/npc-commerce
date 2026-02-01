"use client";

import { useEffect } from "react";
import { useKeybinds, type Shortcut } from "@/providers/keybind-provider";

export function useKeyboardShortcut(
  shortcut: Omit<Shortcut, "handler"> & { handler: () => void },
) {
  const { register } = useKeybinds();

  useEffect(() => {
    const unregister = register(shortcut);
    return unregister;
  }, [register, shortcut.keys, shortcut.label, shortcut.group, shortcut.handler]);
}
