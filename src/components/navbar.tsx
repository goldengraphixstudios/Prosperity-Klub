"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Globe,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Users,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { guidedNotSoldLine, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [resourcesOpen, setResourcesOpen] = React.useState(false);
  const [activeResourcePanel, setActiveResourcePanel] = React.useState<
    "tools" | "ecosystem"
  >("tools");
  const [joinOpen, setJoinOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const resourcesRef = React.useRef<HTMLDivElement>(null);
  const joinRef = React.useRef<HTMLDivElement>(null);

  const calculators = [
    { label: "Debt Strategies Calculator", href: "/debt-strategies" },
    { label: "Savings Calculator", href: "/savings-calculator" },
  ];
  const ecosystemLinks = [
    { label: "Partners", href: "/partners" },
    { label: "Provider Links", href: "/links" },
  ];
  const resourcePanels = {
    tools: {
      label: "Tools",
      links: calculators,
    },
    ecosystem: {
      label: "Ecosystem",
      links: ecosystemLinks,
    },
  } as const;
  const primaryNav = siteConfig.nav.filter(
    (item) => item.label !== "Resources" && item.label !== "Membership"
  );
  const joinLinks = [
    {
      label: "Book Free Financial Clarity Session",
      href: "/book",
      icon: CalendarDays,
      internal: true,
    },
    {
      label: "Join Messenger Group",
      href: "https://www.messenger.com/t/4195348993870330",
      icon: MessageCircle,
    },
    {
      label: "WhatsApp Group",
      href: "https://chat.whatsapp.com/G3QCZqVdht78Xu1VjsO8Pe",
      icon: Users,
    },
    {
      label: "Message on WhatsApp",
      href: "https://api.whatsapp.com/send?phone=639308525204",
      icon: Phone,
    },
    {
      label: "Email Us",
      href: "mailto:philipianymbong@gmail.com",
      icon: Mail,
    },
    {
      label: "Facebook Page",
      href: "https://www.facebook.com/prosperityklub",
      icon: Globe,
    },
  ];

  React.useEffect(() => {
    setMenuOpen(false);
    setResourcesOpen(false);
    setActiveResourcePanel("tools");
    setJoinOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!resourcesOpen && !joinOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (resourcesRef.current && !resourcesRef.current.contains(target)) {
        setResourcesOpen(false);
      }
      if (joinRef.current && !joinRef.current.contains(target)) {
        setJoinOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setResourcesOpen(false);
        setJoinOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [resourcesOpen, joinOpen]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isResourcesActive =
    pathname.startsWith("/resources") ||
    pathname.startsWith("/debt-strategies") ||
    pathname.startsWith("/savings-calculator") ||
    pathname.startsWith("/partners") ||
    pathname.startsWith("/links") ||
    pathname.startsWith("/membership");

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
  const currentResourcePanel = resourcePanels[activeResourcePanel];

  const linkBase =
    "relative text-sm font-medium text-brand-muted transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-brand-gold after:transition-transform after:duration-300 hover:after:scale-x-100";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 transition-shadow",
        scrolled ? "border-black/10 shadow-sm" : "border-black/5"
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={withBasePath("/brand/logo-update.png")}
            alt="Prosperity Klub"
            width={96}
            height={30}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                linkBase,
                isActive(item.href) && "text-brand-primary after:scale-x-100"
              )}
            >
              {item.label}
            </Link>
          ))}
          <div
            className="relative"
            ref={resourcesRef}
            onMouseEnter={() => {
              setResourcesOpen(true);
            }}
            onMouseLeave={() => {
              setResourcesOpen(false);
              setActiveResourcePanel("tools");
            }}
          >
            <button
              type="button"
              className={cn(
                linkBase,
                "flex items-center gap-1.5",
                isResourcesActive && "text-brand-primary after:scale-x-100"
              )}
              aria-haspopup="menu"
              aria-expanded={resourcesOpen}
              onClick={() => {
                setResourcesOpen((prev) => !prev);
                setActiveResourcePanel("tools");
                setJoinOpen(false);
              }}
            >
              Resources
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  resourcesOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {resourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 mt-2 grid w-[32rem] grid-cols-[220px_1fr] overflow-hidden rounded-2xl border border-brand-primary/10 bg-white/95 shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
                >
                  <div className="border-r border-brand-primary/10 bg-brand-primary/[0.03] p-3">
                    <div className="flex flex-col gap-2">
                      {(["tools", "ecosystem"] as const).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onMouseEnter={() => setActiveResourcePanel(key)}
                          onFocus={() => setActiveResourcePanel(key)}
                          onClick={() => setActiveResourcePanel(key)}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors",
                            activeResourcePanel === key
                              ? "bg-brand-primary text-white"
                              : "bg-white text-brand-primary hover:bg-brand-primary/5"
                          )}
                        >
                          {resourcePanels[key].label}
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      ))}
                      <Link
                        href="/resources"
                        className={cn(
                          "rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                          pathname.startsWith("/resources")
                            ? "bg-brand-gold text-white"
                            : "bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-white"
                        )}
                      >
                        Free Ebook
                      </Link>
                      <Link
                        href="/membership"
                        className={cn(
                          "rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                          pathname.startsWith("/membership")
                            ? "bg-brand-gold text-white"
                            : "bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-white"
                        )}
                      >
                        Membership
                      </Link>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="rounded-2xl border border-brand-primary/10 bg-white p-3">
                      <p className="px-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand-secondary">
                        {currentResourcePanel.label}
                      </p>
                      <div className="mt-3 flex flex-col gap-2">
                        {currentResourcePanel.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-primary/5 hover:text-brand-primary",
                              pathname.startsWith(link.href) &&
                                "bg-brand-primary/10 font-semibold text-brand-primary"
                            )}
                          >
                            {link.label}
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative" ref={joinRef}>
            <button
              type="button"
              className={cn(linkBase, "flex items-center gap-1.5")}
              aria-haspopup="menu"
              aria-expanded={joinOpen}
              onClick={() => {
                setJoinOpen((prev) => !prev);
                setResourcesOpen(false);
              }}
            >
              Connect
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  joinOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {joinOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 mt-2 w-64 rounded-xl border border-brand-primary/10 bg-white/95 p-2 shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
                >
                  {joinLinks.map((link) => {
                    const Icon = link.icon;
                    const linkContent = (
                      <>
                        <Icon className="h-4 w-4 text-brand-secondary" />
                        {link.label}
                      </>
                    );

                    if ("internal" in link && link.internal) {
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-brand-primary transition-colors hover:bg-brand-primary/5"
                        >
                          {linkContent}
                        </Link>
                      );
                    }

                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-muted transition-colors hover:bg-brand-primary/5 hover:text-brand-primary"
                      >
                        {linkContent}
                      </a>
                    );
                  })}
                  <p className="px-3 pt-2 text-[11px] leading-5 text-brand-muted">
                    {guidedNotSoldLine}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="hidden md:flex">
          <Button asChild variant="gold" size="sm" className="hover:scale-[1.02]">
            <Link href="/book">Book a Free Financial Clarity Session</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="h-6 w-6 text-brand-primary" />
        </button>
      </div>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="top-0 left-0 h-full w-full max-w-none translate-x-0 translate-y-0 rounded-none border-none bg-white p-6">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle>Menu</DialogTitle>
            <button
              className="rounded-md p-2 text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-4">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5",
                  isActive(item.href) && "bg-brand-primary/10"
                )}
              >
                {item.label}
              </Link>
            ))}

            <Accordion
              type="single"
              collapsible
              defaultValue={isResourcesActive ? "resources" : undefined}
            >
              <AccordionItem value="resources" className="border-none">
                <AccordionTrigger className="px-3 py-2 text-sm font-semibold text-brand-primary">
                  Resources
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pt-2">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="tools" className="rounded-2xl border border-brand-primary/10 px-2">
                        <AccordionTrigger className="px-3 py-3 text-sm font-semibold text-brand-primary">
                          Tools
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2 pb-2">
                            {calculators.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                  "rounded-lg px-3 py-2 text-sm text-brand-muted transition-colors hover:bg-brand-primary/5 hover:text-brand-primary",
                                  pathname.startsWith(link.href) &&
                                    "bg-brand-primary/10 font-semibold text-brand-primary"
                                )}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                      <AccordionItem
                        value="ecosystem"
                        className="rounded-2xl border border-brand-primary/10 px-2"
                      >
                        <AccordionTrigger className="px-3 py-3 text-sm font-semibold text-brand-primary">
                          Ecosystem
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2 pb-2">
                            {ecosystemLinks.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                  "rounded-lg px-3 py-2 text-sm text-brand-muted transition-colors hover:bg-brand-primary/5 hover:text-brand-primary",
                                  pathname.startsWith(link.href) &&
                                    "bg-brand-primary/10 font-semibold text-brand-primary"
                                )}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Link
                      href="/resources"
                      className={cn(
                        "rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                        pathname.startsWith("/resources")
                          ? "bg-brand-gold text-white"
                          : "bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-white"
                      )}
                    >
                      Free Ebook
                    </Link>
                    <Link
                      href="/membership"
                      className={cn(
                        "rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                        pathname.startsWith("/membership")
                          ? "bg-brand-gold text-white"
                          : "bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-white"
                      )}
                    >
                      Membership
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="join" className="border-none">
                <AccordionTrigger className="px-3 py-2 text-sm font-semibold text-brand-primary">
                  Connect
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 pt-2">
                    {joinLinks.map((link) => {
                      const Icon = link.icon;
                      if ("internal" in link && link.internal) {
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5"
                          >
                            <Icon className="h-4 w-4 text-brand-secondary" />
                            {link.label}
                          </Link>
                        );
                      }
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-muted transition-colors hover:bg-brand-primary/5 hover:text-brand-primary"
                        >
                          <Icon className="h-4 w-4 text-brand-secondary" />
                          {link.label}
                        </a>
                      );
                    })}
                    <p className="px-3 text-[11px] leading-5 text-brand-muted">
                      {guidedNotSoldLine}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button asChild variant="gold" className="w-full">
              <Link href="/book">Book a Free Financial Clarity Session</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
