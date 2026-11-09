/** What the live card and the ladder card share: the app's card container and text colors. */
export const CARD = "overflow-hidden rounded-[20px] border-[0.5px] border-black/[0.06] bg-white shadow-[0_4px_16px_rgba(0,0,0,.14)]";

export const TEXT = "#11181C";
export const MUTED = "#8B8F98";
export const GREEN = "#00A57C";

export const cx = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(" ");
