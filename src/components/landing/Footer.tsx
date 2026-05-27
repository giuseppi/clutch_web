import { Link } from "react-router-dom";
import clutchLogo from "@/assets/clutch_logo.png";

const columns = [
  {
    head: "PRODUCT",
    items: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Coming Soon", href: "/#download" },
    ],
  },
];

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
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm text-ink/80 hover:text-brand transition-colors"
            >
              Meet the Team →
            </Link>
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
