"use client";

import { motion } from "framer-motion";
import { PrimaryButton } from "../Buttons";
import { site } from "@/lib/site";

const easing = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } },
};

export function HeroContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col items-center justify-between text-center"
    >
      <div className="flex flex-col items-center">
        <motion.span
          variants={item}
          className="inline-flex items-center rounded-full bg-white/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-soft shadow-sm"
        >
          NSW&apos;s Trusted Car Removal Team
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-balance mt-3 max-w-xl text-2xl font-extrabold leading-tight text-ink [text-shadow:0_2px_14px_rgba(255,255,255,0.9)] sm:text-3xl lg:text-4xl"
        >
          Top Cash For Your Car,{" "}
          <span className="whitespace-nowrap rounded-lg bg-brand px-1.5 text-ink">
            Up To {site.cashOfferMax}
          </span>
          !
        </motion.h1>
      </div>

      <motion.div variants={item}>
        <PrimaryButton href="/contact">Get Your Free Quote</PrimaryButton>
      </motion.div>
    </motion.div>
  );
}
