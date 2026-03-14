"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealVariant = "fadeUp" | "fadeIn" | "scaleIn" | "staggerChildren";

type ScrollRevealProps = {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  once?: boolean;
  className?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const itemVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1 },
  },
};

const parentVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  once = true,
  className,
}: ScrollRevealProps) {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -15% 0px" });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (prefersReduced || !mounted) {
    return <div className={className}>{children}</div>;
  }

  if (variant === "staggerChildren") {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={parentVariants}
        transition={{ delay, duration: 0.6, ease }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={itemVariants[variant]}
      transition={{ delay, duration: 0.6, ease }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  variant = "fadeUp",
  className,
}: {
  children: React.ReactNode;
  variant?: Exclude<RevealVariant, "staggerChildren">;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (prefersReduced || !mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("h-full", className)}
      variants={itemVariants[variant]}
      transition={{ duration: 0.6, ease }}
    >
      {children}
    </motion.div>
  );
}
