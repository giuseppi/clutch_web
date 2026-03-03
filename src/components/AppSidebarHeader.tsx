import { Link } from "react-router-dom";

/** App brand name shown in app sidebar and mobile headers. Stays constant across all app tabs. */
export const APP_BRAND_NAME = "Clutch";

const ClutchLogoSvg = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      clipRule="evenodd"
      d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

interface AppSidebarHeaderProps {
  /** Optional class for the header wrapper (e.g. border, padding). */
  className?: string;
  /** Use compact styling (e.g. for mobile header, no drop shadow). */
  compact?: boolean;
}

/**
 * Shared app sidebar/mobile header: logo + "Clutch" linking to home.
 * Keeps branding constant across all app tabs.
 */
const AppSidebarHeader = ({ className = "", compact = false }: AppSidebarHeaderProps) => {
  return (
    <Link
      to="/"
      className={`flex items-center gap-3 text-slate-100 hover:text-slate-100 ${className}`}
      aria-label={`${APP_BRAND_NAME} – go to home`}
    >
      <div
        className={
          compact
            ? "size-8 text-[#ff6a00]"
            : "size-8 text-[#ff6a00] drop-shadow-[0_0_8px_rgba(255,106,0,0.5)]"
        }
      >
        <ClutchLogoSvg />
      </div>
      <span className="text-lg font-bold tracking-tight">{APP_BRAND_NAME}</span>
    </Link>
  );
};

export default AppSidebarHeader;
