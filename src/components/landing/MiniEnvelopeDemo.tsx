"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Volume2 } from "lucide-react";
import { STARTER_TEMPLATES } from "@/lib/templates/presets";
import { WaxSeal } from "@/components/invitation/WaxSeal";

export function MiniEnvelopeDemo() {
  const [unsealed, setUnsealed] = useState(false);
  const template = STARTER_TEMPLATES[0].default_config;

  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <motion.div
        animate={unsealed ? { y: -14 } : { y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-amber-300/60 bg-[#114232] p-6 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-3 rounded-2xl border border-amber-400/30 pointer-events-none" />

        <div className="relative z-10 rounded-2xl bg-[#FAF6EE] px-5 py-6 text-[#17261F] shadow-inner">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#5E6B64]">
            Together with their families
          </p>
          <h3
            className="mt-2 text-2xl font-semibold text-[#114232]"
            style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
          >
            Amina &amp; Zayan
          </h3>
          <p
            className="mt-1 text-lg text-[#B3842B]"
            style={{ fontFamily: "var(--font-great-vibes), cursive" }}
          >
            February 14, 2027
          </p>

          {unsealed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 pt-3 border-t border-amber-900/15 space-y-2"
            >
              <p className="text-xs text-[#5E6B64]">
                The Serai Courtyard · Lahore
              </p>
              <Link
                href="/e/demo"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#114232] px-4 py-1.5 text-[11px] font-medium text-amber-100 hover:bg-[#175440] transition"
              >
                <span>Open Full Experience</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          )}
        </div>

        <div className="relative z-20 -mt-7 flex flex-col items-center">
          <WaxSeal
            waxSeal={template.envelope.waxSeal}
            onClick={() => setUnsealed((prev) => !prev)}
            size="sm"
          />
          <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-amber-100/90">
            {unsealed ? (
              <>
                <Volume2 className="w-3 h-3 text-amber-300" />
                <span>Tap seal to reseal or launch full demo</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Tap wax seal to preview reveal</span>
              </>
            )}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

