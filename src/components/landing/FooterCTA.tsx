import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SplitText } from "./SplitText";
import { useEntranceSettled } from "@/lib/entrance";
import { riseVariants } from "@/lib/motion";
import { GRID } from "./game/layout";

const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSeUaa-wN0BkWVDut3uHLwBpecVIUdt2opIn5pzhvcniZHOH9g/formResponse";
const GOOGLE_FORM_EMAIL_FIELD = "entry.2010243805";

/**
 * The beta sign-up section. The headline and the form reveal from one trigger behind the
 * entrance's settle, the form 0.4 s after the headline, so it never shows before it.
 */
const FooterCTA = () => {
  const groupRef = useRef<HTMLDivElement>(null);
  const settled = useEntranceSettled();
  const shown = useInView(groupRef, { once: true, amount: 0.3 }) && settled;

  return (
    <div id="download" className="relative bg-paper text-ink paper-grain py-24 md:py-36 overflow-hidden">
      <Glow />
      <div className={`relative ${GRID}`}>
        <div className="flex items-baseline justify-between border-b border-ink/15 pb-5 mb-12 md:mb-16">
          <span className="label text-inkMuted">COMING SOON · 04</span>
          <span className="label text-inkMuted hidden md:inline">EARLY ACCESS / BETA</span>
        </div>

        <div ref={groupRef}>
          {/* Under 381 px wide the type shrinks with the screen (10.5vw), so each line stays whole. */}
          <SplitText
            as="h2"
            text="Track every shot."
            whileInView={false}
            play={shown}
            className="font-display text-[clamp(min(2.5rem,10.5vw),9vw,8rem)] text-ink"
          />
          <SplitText
            as="h2"
            text="Climb the ranks."
            whileInView={false}
            play={shown}
            className="font-display text-[clamp(min(2.5rem,10.5vw),9vw,8rem)] text-brand pl-[6vw] md:pl-[min(18vw,259px)]"
          />

          <motion.div
            variants={riseVariants}
            initial="hidden"
            animate={shown ? "visible" : "hidden"}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-12 gap-y-8 md:gap-x-12 mt-12 md:mt-16 items-end"
          >
            <p className="md:col-span-5 text-base md:text-lg text-ink/70 leading-relaxed max-w-md">
              iOS, Android, and web are all coming soon. Be on the list when the
              beta opens.
            </p>
            <BetaForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/** The soft orange glow behind the section. */
const Glow = () => (
  <div
    aria-hidden
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
    style={{ background: "radial-gradient(circle, rgba(255,106,0,0.10), transparent 70%)" }}
  />
);

/** Posts the email to the Google Form. It is a no-cors post, so the response is opaque. */
async function joinBeta(email: string): Promise<void> {
  const formData = new URLSearchParams();
  formData.append(GOOGLE_FORM_EMAIL_FIELD, email);
  await fetch(GOOGLE_FORM_ACTION, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
}

/** The beta sign-up: sends the email, then thanks the visitor. */
const BetaForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    try {
      if (GOOGLE_FORM_ACTION && GOOGLE_FORM_EMAIL_FIELD) await joinBeta(email);
      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Try again.");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="md:col-span-7 md:col-start-6 flex flex-col sm:flex-row gap-3 md:items-end md:justify-end"
    >
      {submitted ? (
        <div className="label text-brand bg-brand/10 border border-brand/30 px-6 py-4">
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
            {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
          </label>
          <button
            type="submit"
            className="btn-sharp bg-brand text-white label px-8 py-4 hover:bg-brand/90 transition-colors whitespace-nowrap"
          >
            GET IN TOUCH
          </button>
        </>
      )}
    </form>
  );
};

export default FooterCTA;
