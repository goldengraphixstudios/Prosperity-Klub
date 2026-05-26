"use client";

import * as React from "react";

const SmoothScrollContext = React.createContext<{
  scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void;
} | null>(null);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollTo = React.useCallback(
    (target: string | HTMLElement, options?: { offset?: number }) => {
      const offset = options?.offset ?? -84;
      const element =
        typeof target === "string"
          ? document.querySelector<HTMLElement>(target)
          : target;

      if (!element) return;

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY + offset,
        behavior: "auto",
      });
    },
    []
  );

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return React.useContext(SmoothScrollContext);
}
