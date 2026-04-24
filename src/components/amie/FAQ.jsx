import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from './Section.jsx';

const FAQS = [
  { q: 'How do I validate a startup idea before building an MVP?', a: 'Validate by measuring real demand instead of asking opinions. MarketIQ.ai scans search intent, social signals, competitor pricing pages, and review data to quantify whether a market exists, who actually pays, and what gaps remain — so you can decide before you write a line of code.' },
  { q: 'What makes MarketIQ.ai different from generic AI tools for market research?', a: 'Most AI tools generate confident opinions from training data. MarketIQ.ai is a decision engine grounded in real-world signals. It runs adaptive questioning, multi-source scans, and a built-in truth layer that rejects weak ideas instead of flattering them.' },
  { q: 'How does MarketIQ.ai find target customers for my startup?', a: 'The customer prioritization engine clusters pain points by urgency, frequency, existing spending behavior, and ease of reach. It returns a ranked list of ICPs — primary buyer, expansion segments, and segments to avoid — so you know exactly who to target first.' },
  { q: 'Can I use MarketIQ.ai for SaaS idea validation specifically?', a: 'Yes. MarketIQ.ai is built for SaaS and product idea validation. It maps the competitive landscape, surfaces pricing benchmarks, identifies underserved niches, and produces a quantified validation score for your concept.' },
  { q: 'How long does a full market validation report take?', a: 'Minutes, not weeks. A typical report — demand insights, competitor map, ranked customer segments, risk vectors, and strategic recommendations — is delivered in a single autonomous run.' },
  { q: 'What does the validation report include?', a: 'A market verdict (strong / risky / not viable), demand signals with sources, competitive landscape and gaps, prioritized customer segments, a risk assessment with critical failure factors, and strategic positioning guidance.' },
  { q: 'Who is MarketIQ.ai for?', a: 'Indie hackers, solo founders, early-stage startup teams, and product managers who need decision-grade evidence before committing engineering cycles to a new product or feature.' },
];

function AccordionItem({ q, a, open, onClick }) {
  return (
    <div className="hairline-b last:border-0">
      <button
        onClick={onClick}
        className="w-full text-left font-display text-xl md:text-2xl py-6 flex items-start justify-between gap-4 transition-opacity hover:opacity-70"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="font-mono text-lg mt-1 shrink-0 transition-transform" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 max-w-3xl text-base leading-relaxed" style={{ color: 'hsl(var(--amie-ink-soft))' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <Section
      id="faq"
      index="009"
      eyebrow="FAQ"
      title={<>Questions founders ask before <em className="font-display italic">validating</em> an idea.</>}
      lede="Straight answers on startup idea validation, customer discovery, and how an autonomous market research engine actually works."
    >
      <div className="hairline-t hairline-b hairline-l hairline-r px-6 md:px-10" style={{ background: 'hsl(var(--amie-bg))' }}>
        {FAQS.map((f, i) => (
          <AccordionItem
            key={i}
            q={f.q}
            a={f.a}
            open={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>
    </Section>
  );
}
