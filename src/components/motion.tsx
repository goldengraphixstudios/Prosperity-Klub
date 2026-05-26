"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.35, ease: easeOut }}
        className="flex-1"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

export function FadeIn({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "className">) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={cn(className)}>{children}</div>;
}

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}
