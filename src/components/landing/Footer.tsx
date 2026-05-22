import clutchLogo from "@/assets/clutch_logo.png";

const columns = [
  {
    head: "PRODUCT",
    items: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Coming Soon", href: "#download" },
    ],
  },
];

const team = [
  { name: "Giuseppi Pelayo", href: "https://www.linkedin.com/in/giuseppipelayo/" },
  { name: "Johnny Fok", href: "https://www.linkedin.com/in/johnnyfok/" },
  { name: "Andrew Espinosa", href: "https://www.linkedin.com/in/andrew-espinosa2002/" },
  { name: "Dylan Nguyen", href: "https://www.linkedin.com/in/dylannguyen-/" },
];

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-3.5 h-3.5 shrink-0"
    aria-hidden
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper text-ink px-6 md:px-12 pt-20 md:pt-24 pb-10 border-t border-ink/10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-12 md:gap-x-12">
          {/* Brand block */}
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-3">
              <img src={clutchLogo} alt="Clutch" className="w-9 h-9 rounded-sm object-contain" />
              <span className="font-display text-2xl text-ink tracking-tight">CLUTCH</span>
            </div>
            <p className="mt-6 max-w-xs text-sm text-ink/60 leading-relaxed">
              AI basketball analytics, built for the leagues that aren't on TV.
            </p>
            <span className="label-mono text-inkMuted block mt-8">IRVINE, CA</span>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.head} className="md:col-span-2">
              <span className="label-mono text-inkMuted block mb-5">{col.head}</span>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-ink/80 hover:text-brand transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect */}
          <div className="col-span-2 md:col-span-3">
            <span className="label-mono text-inkMuted block mb-5">CONNECT WITH US</span>
            <ul className="space-y-3">
              {team.map((person) => (
                <li key={person.name}>
                  <a
                    href={person.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-ink/80 hover:text-brand transition-colors whitespace-nowrap"
                  >
                    <LinkedInIcon />
                    {person.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="mt-20 pt-8 border-t border-ink/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <span className="label-mono text-inkMuted">
            © {year} CLUTCH ANALYTICS · ALL RIGHTS RESERVED
          </span>
          <div className="flex items-center gap-6 label-mono text-inkMuted">
            <a href="#" className="hover:text-ink transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-ink transition-colors">TERMS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
