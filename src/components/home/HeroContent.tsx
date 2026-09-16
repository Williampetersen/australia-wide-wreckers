"use client";

import { motion } from "framer-motion";
import { PillButton } from "../Buttons";
import { ContactForm } from "../ContactForm";
import { CheckCircle2 } from "../Icons";
import { site } from "@/lib/site";

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
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_420px] lg:gap-8">
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.span
          variants={item}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-sm"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-brand" aria-hidden />
          NSW&apos;s trusted car buyer
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-balance mt-5 max-w-xl text-5xl leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4rem]"
        >
          Top cash for
          <br />
          your car.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-md text-lg leading-relaxed text-white/75"
        >
          Used, old, damaged or ready for scrap? We buy it and collect it for
          free, up to {site.cashOfferMax} cash — anywhere across NSW.
        </motion.p>

        <motion.p
          variants={item}
          className="mt-3 max-w-md text-sm leading-relaxed font-medium text-white/60"
        >
          Based in Muswellbrook. Cash paid at pickup. No listing, no
          strangers, no paperwork for you.
        </motion.p>

        <motion.div variants={item} className="mt-8">
          <PillButton href="#get-offer">Get an offer</PillButton>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 flex items-center gap-3 border-l-2 border-white/30 pl-4 text-sm leading-snug text-white/60"
        >
          NSW-wide car removal.
          <br />
          Free collection, every time.
        </motion.div>
      </motion.div>

      <motion.div
        id="get-offer"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: easing }}
        className="scroll-mt-24"
      >
        <ContactForm variant="glass" />
      </motion.div>
    </div>
  );
}
