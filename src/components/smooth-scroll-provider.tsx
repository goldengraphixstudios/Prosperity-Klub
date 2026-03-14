"use client";

import * as React from "react";
import Lenis from "lenis";

const SmoothScrollContext = React.createContext<{
  scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void;
} | null>(null);

type LenisGlobal = {
  __PK_LENIS?: Lenis;
  __PK_LENIS_RAF?: number;
  __PK_LENIS_WRAPPER?: Window | HTMLElement | null;
  __PK_LENIS_CONTENT?: HTMLElement | null;
};

function getGlobal(): LenisGlobal {
  return globalThis as LenisGlobal;
}

function detectScrollContainer(): {
  wrapper: Window | HTMLElement;
  content: HTMLElement;
} {
  const scrollingElement = document.scrollingElement as HTMLElement | null;
  if (
    scrollingElement &&
    scrollingElement.scrollHeight > scrollingElement.clientHeight &&
    getComputedStyle(scrollingElement).overflowY !== "hidden"
  ) {
    return { wrapper: window, content: document.documentElement };
  }

  const elements = Array.from(document.querySelectorAll<HTMLElement>("body *"));
  const scrollables = elements.filter((el) => {
    const style = getComputedStyle(el);
    const overflowY = style.overflowY;
    const isScrollable =
      (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
      el.scrollHeight > el.clientHeight &&
      el.clientHeight > 300;
    return isScrollable;
  });

  if (scrollables.length) {
    scrollables.sort(
      (a, b) =>
        b.scrollHeight - b.clientHeight - (a.scrollHeight - a.clientHeight)
    );
    const wrapper = scrollables[0];
    const content = (wrapper.firstElementChild as HTMLElement) ?? wrapper;
    return { wrapper, content };
  }

  return { wrapper: window, content: document.documentElement };
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = React.useRef<Lenis | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobileUA = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(
      navigator.userAgent
    );

    // Only disable on true mobile UA. Do not disable on desktop even if
    // reduced-motion is set, since smooth scrolling is explicitly requested.
    const disableLenis = isMobileUA;

    if (disableLenis) {
      return;
    }

    const { wrapper, content } = detectScrollContainer();

    const global = getGlobal();
    const hasExisting = Boolean(global.__PK_LENIS);
    const wrapperChanged =
      global.__PK_LENIS_WRAPPER && global.__PK_LENIS_WRAPPER !== wrapper;
    const contentChanged =
      global.__PK_LENIS_CONTENT && global.__PK_LENIS_CONTENT !== content;

    if (hasExisting && (wrapperChanged || contentChanged)) {
      global.__PK_LENIS?.destroy();
      if (global.__PK_LENIS_RAF) {
        window.cancelAnimationFrame(global.__PK_LENIS_RAF);
        global.__PK_LENIS_RAF = undefined;
      }
      global.__PK_LENIS = undefined;
    }

    let createdHere = false;
    if (!global.__PK_LENIS) {
      const config = {
        duration: 0.85,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1.25,
        touchMultiplier: 1,
        easing: (t: number) => 1 - Math.pow(1 - t, 5),
      };

      global.__PK_LENIS =
        wrapper === window
          ? new Lenis(config)
          : new Lenis({
              ...config,
              wrapper: wrapper as HTMLElement,
              content,
            });

      global.__PK_LENIS_WRAPPER = wrapper;
      global.__PK_LENIS_CONTENT = content;
      createdHere = true;
    }

    const lenis = global.__PK_LENIS;
    lenisRef.current = lenis;
    document.documentElement.classList.add("lenis", "lenis-smooth");

    if (process.env.NODE_ENV === "development") {
      console.log("[PK Lenis] active");
    }

    if (!global.__PK_LENIS_RAF) {
      const raf = (time: number) => {
        global.__PK_LENIS?.raf(time);
        global.__PK_LENIS_RAF = window.requestAnimationFrame(raf);
      };
      global.__PK_LENIS_RAF = window.requestAnimationFrame(raf);
    }

    let lastLog = 0;
    const handleScroll = (data: { scroll: number }) => {
      if (process.env.NODE_ENV !== "development") return;
      const now = Date.now();
      if (now - lastLog < 1200) return;
      lastLog = now;
      console.log("[PK Lenis] scroll", Math.round(data.scroll));
    };
    lenis.on("scroll", handleScroll);

    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      lenis.scrollTo(hash, { offset: -84 });
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const element = document.querySelector<HTMLElement>(href);
      if (!element) return;
      event.preventDefault();
      lenis.scrollTo(element, { offset: -84 });
    };

    window.addEventListener("hashchange", handleHash);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("hashchange", handleHash);
      document.removeEventListener("click", handleClick);
      lenis.off("scroll", handleScroll);

      if (createdHere) {
        lenis.destroy();
        global.__PK_LENIS = undefined;
      }

      if (global.__PK_LENIS_RAF && createdHere) {
        window.cancelAnimationFrame(global.__PK_LENIS_RAF);
        global.__PK_LENIS_RAF = undefined;
      }

      document.documentElement.classList.remove("lenis", "lenis-smooth");
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = React.useCallback(
    (target: string | HTMLElement, options?: { offset?: number }) => {
      const offset = options?.offset ?? -84;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset });
        return;
      }
      if (typeof target === "string") {
        const element = document.querySelector(target);
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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
