"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export interface Shortcut {
  keys: string;
  label: string;
  group: string;
  handler: () => void;
}

interface KeybindContextValue {
  shortcuts: Shortcut[];
  register: (shortcut: Shortcut) => () => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
}

const KeybindContext = createContext<KeybindContextValue | null>(null);

export function KeybindProvider({ children }: { children: React.ReactNode }) {
  const shortcutsRef = useRef<Shortcut[]>([]);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const pendingKeyRef = useRef<string | null>(null);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const register = useCallback((shortcut: Shortcut) => {
    shortcutsRef.current = [...shortcutsRef.current, shortcut];
    setShortcuts([...shortcutsRef.current]);
    return () => {
      shortcutsRef.current = shortcutsRef.current.filter((s) => s !== shortcut);
      setShortcuts([...shortcutsRef.current]);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (isInput) return;

      const mod = e.metaKey || e.ctrlKey;

      // Handle Escape
      if (e.key === "Escape") {
        if (showHelp) setShowHelp(false);
        // Let other handlers (drawers, modals) also catch Escape
        return;
      }

      // Handle ? for help
      if (e.key === "?" && !mod) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Handle Cmd/Ctrl+K
      if (mod && e.key === "k") {
        e.preventDefault();
        const sc = shortcutsRef.current.find((s) => s.keys === "Mod+K");
        sc?.handler();
        return;
      }

      // Handle two-key sequences like "G then P"
      if (pendingKeyRef.current) {
        const combo = `${pendingKeyRef.current} then ${e.key.toUpperCase()}`;
        const sc = shortcutsRef.current.find((s) => s.keys === combo);
        if (sc) {
          e.preventDefault();
          sc.handler();
        }
        pendingKeyRef.current = null;
        if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
        return;
      }

      // Start a sequence with G
      if (e.key.toUpperCase() === "G" && !mod) {
        pendingKeyRef.current = "G";
        if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = setTimeout(() => {
          pendingKeyRef.current = null;
        }, 1000);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showHelp]);

  return (
    <KeybindContext.Provider value={{ shortcuts, register, showHelp, setShowHelp }}>
      {children}
    </KeybindContext.Provider>
  );
}

export function useKeybinds() {
  const context = useContext(KeybindContext);
  if (!context) {
    throw new Error("useKeybinds must be used within a KeybindProvider");
  }
  return context;
}
