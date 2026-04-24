import { motion } from 'framer-motion';

export function Section({ id, index, eyebrow, title, lede, children, className = '' }) {
  return (
    <section id={id} className={`relative py-24 md:py-32 hairline-t ${className}`}>
      <div className="container-edge">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          <div className="lg:col-span-3 flex lg:flex-col items-start justify-between gap-4">
            <span className="eyebrow">{index}</span>
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <div className="lg:col-span-9">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] max-w-4xl"
            >
              {title}
            </motion.h2>
            {lede && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mt-6 text-lg ink-soft max-w-2xl leading-relaxed"
              >
                {lede}
              </motion.p>
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
