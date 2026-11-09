import { render, screen } from "@testing-library/react";
import { motion } from "framer-motion";
import { describe, expect, it } from "vitest";
import { riseVariants } from "./motion";

const Box = ({ delay }: { delay: number }) => (
  <motion.div
    data-testid="box"
    variants={riseVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
  />
);

const opacityAfter = async (delay: number) => {
  render(<Box delay={delay} />);
  await new Promise((r) => setTimeout(r, 300));
  return Number(screen.getByTestId("box").style.opacity);
};

describe("riseVariants", () => {
  it("keeps the caller's delay: a delayed element is not revealed early", async () => {
    expect(await opacityAfter(5)).toBe(0);
  });

  it("reveals without a delay", async () => {
    expect(await opacityAfter(0)).toBeGreaterThan(0);
  });
});
