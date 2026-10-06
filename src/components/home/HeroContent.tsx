"use client";

import { motion } from "framer-motion";
import { PrimaryButton } from "../Buttons";
import { QuoteForm } from "../quote/QuoteForm";
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
      className="grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_24rem]"
    >
      <div className="flex flex-col items-center rounded-3xl bg-white/80 p-6 text-center shadow-[0_20px_60px_rgba(0,35,80,0.2)] backdrop-blur-md sm:p-8">
        <motion.span
          variants={item}
          className="inline-flex items-center rounded-full bg-white/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-soft shadow-sm"
        >
          NSW&apos;s Trusted Car Removal Team
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-balance mt-3 max-w-xl text-2xl font-extrabold leading-[1.05] tracking-tight text-ink [text-shadow:0_2px_14px_rgba(255,255,255,0.9)] sm:text-4xl lg:text-5xl"
        >
          Top Cash For Your Car,{" "}
          <span className="whitespace-nowrap rounded-lg bg-brand px-1.5 text-ink">
            Up To {site.cashOfferMax}
          </span>
          !
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-3 font-display text-base font-semibold text-navy sm:text-lg"
        >
          The biggest car buyers across Newcastle, Lake Macquarie &amp; the Hunter
        </motion.p>

        <motion.div variants={item} className="mt-6">
          <PrimaryButton href="/get-quote">Get Your Cash Offer</PrimaryButton>
        </motion.div>
      </div>

      <motion.div variants={item} className="w-full max-w-sm justify-self-center lg:max-w-none lg:justify-self-end">
        <QuoteForm />
      </motion.div>
    </motion.div>
  );
}
