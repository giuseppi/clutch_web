import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const team = [
  {
    name: "Johnny Fok",
    linkedin: "https://www.linkedin.com/in/johnnyfok/",
    initials: "JF",
    photo: "/johnnyf.webp",
  },
  {
    name: "Giuseppi Pelayo",
    linkedin: "https://www.linkedin.com/in/giuseppipelayo/",
    initials: "GP",
    photo: "/giuseppip.png",
  },
  {
    name: "Dylan Nguyen",
    linkedin: "https://www.linkedin.com/in/dylannguyen-/",
    initials: "DN",
    photo: "/dylann.jpg",
  },
  {
    name: "Andrew Espinosa",
    linkedin: "https://www.linkedin.com/in/andrew-espinosa2002/",
    initials: "AE",
    photo: "/andrewe.png",
  },
];

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 shrink-0"
    aria-hidden
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ContactPage = () => (
  <div className="min-h-screen bg-paper text-ink">
    <Navbar />

    <main className="pt-28 md:pt-36 pb-24 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-baseline justify-between border-b border-ink/15 pb-5 mb-12 md:mb-16">
          <span className="label-mono text-inkMuted">THE TEAM</span>
          <span className="label-mono text-inkMuted hidden md:inline">
            CONNECT WITH US
          </span>
        </div>

        <h1 className="font-display font-medium text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-tight text-ink mb-16 md:mb-24">
          Meet the team<span className="text-brand">.</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {team.map((member) => (
            <a
              key={member.name}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-ink/10 p-6 md:p-8 transition-colors hover:border-brand/40 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden bg-paperAlt border border-ink/15 mb-6 flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    el.parentElement!.innerHTML = `<span class="font-display text-4xl md:text-5xl text-ink/40 select-none">${member.initials}</span>`;
                  }}
                />
              </div>

              <h2 className="font-display text-2xl md:text-3xl tracking-tight text-ink mb-3 group-hover:text-brand transition-colors">
                {member.name}
              </h2>

              <span className="inline-flex items-center gap-2 text-sm text-ink/70 group-hover:text-brand transition-colors">
                <LinkedInIcon />
                <span className="font-mono text-xs underline underline-offset-4 decoration-ink/20 group-hover:decoration-brand">
                  LinkedIn Profile
                </span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-16 md:mt-24 pt-8 border-t border-ink/10">
          <Link
            to="/"
            className="label-mono text-inkMuted hover:text-ink transition-colors"
          >
            ← BACK TO HOME
          </Link>
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default ContactPage;
