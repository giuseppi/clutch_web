import { useState } from "react";
import { motion } from "framer-motion";
import { SplitText } from "./SplitText";

const STORAGE_KEY = "clutch_beta_emails";

const saveBetaEmail = (email: string) => {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!existing.includes(email)) {
      existing.push(email);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([email]));
  }
};

const FooterCTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    saveBetaEmail(email);
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div id="download" className="relative bg-paper text-ink paper-grain px-6 md:px-12 py-24 md:py-36 overflow-hidden">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,106,0,0.10), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1440px] mx-auto">
        <div className="flex items-baseline justify-between border-b border-ink/15 pb-5 mb-12 md:mb-16">
          <span className="label-mono text-inkMuted">DOWNLOAD — 04</span>
          <span className="label-mono text-inkMuted hidden md:inline">EARLY ACCESS / BETA</span>
        </div>

        <SplitText
          as="h2"
          text="Track every shot."
          className="font-display font-medium text-[clamp(2.5rem,9vw,8rem)] text-ink"
        />
        <SplitText
          as="h2"
          text="Climb the ranks."
          className="font-display font-medium italic text-[clamp(2.5rem,9vw,8rem)] text-brand pl-[6vw] md:pl-[18vw]"
          stagger={0.04}
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-12 gap-y-8 md:gap-x-12 mt-12 md:mt-16 items-end"
        >
          <p className="md:col-span-5 text-base md:text-lg text-ink/70 leading-relaxed max-w-md">
            iOS, Android, and web — all coming soon. Be on the list when the
            beta opens.
          </p>

          <form
            onSubmit={handleSubmit}
            className="md:col-span-7 md:col-start-6 flex flex-col sm:flex-row gap-3 md:items-end md:justify-end"
          >
            {submitted ? (
              <div className="label-mono text-brand bg-brand/10 border border-brand/30 px-6 py-4">
                ✓ YOU'RE ON THE LIST.
              </div>
            ) : (
              <>
                <label className="flex-1 max-w-md">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-ink/30 focus:border-brand focus:outline-none px-0 py-3 font-mono text-sm text-ink placeholder:text-ink/40 transition-colors"
                  />
                </label>
                <button
                  type="submit"
                  className="btn-sharp bg-brand text-white label-mono px-8 py-4 hover:bg-brand/90 transition-colors whitespace-nowrap"
                >
                  GET IN TOUCH
                </button>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default FooterCTA;
