"use client";

import { motion } from "framer-motion";
import { PrimaryButton, CallButton } from "../Buttons";
import { CheckCircle2 } from "../Icons";
import { ContactForm } from "../ContactForm";
import { site } from "@/lib/site";

const trustPoints = [
  "Free towing, every time",
  "All makes & conditions",
  "Cash paid on pickup",
  "NSW-wide service",
];

const easing = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } },
};

export function HeroContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-8 xl:gap-14"
    >
      <div>
        <motion.span
          variants={item}
          className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand"
        >
          NSW&apos;s Trusted Car Removal Team
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-balance mt-6 text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
        >
          Top Cash For Your Car,{" "}
          <span className="text-brand">Up To {site.cashOfferMax}</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-200"
        >
          {site.description} Get a free quote now and have it picked up as
          soon as today.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-col gap-4 sm:flex-row">
          <PrimaryButton href="/contact">Get Your Free Quote</PrimaryButton>
          <CallButton />
        </motion.div>

        <motion.ul variants={item} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3">
          {trustPoints.map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 text-sm font-medium text-zinc-200"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              {point}
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        variants={item}
        className="w-full max-w-md justify-self-center rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:p-7 lg:max-w-none lg:justify-self-end"
      >
        <h2 className="font-display text-lg font-bold text-white sm:text-xl">
          Get Cash Offer Now
        </h2>
        <div className="mt-5">
          <ContactForm variant="glass" />
        </div>
      </motion.div>
    </motion.div>
  );
}
