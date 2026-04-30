import basketballImg from '@/assets/basketball.png';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import Matter from 'matter-js';
import { useEffect, useRef, useState } from 'react';

/**
 * Single-viewport (100vh) editorial hero. Centerpiece is a basketball
 * that responds to scroll *physically*: each scroll gesture imparts an
 * impulse, gravity pulls it down, friction settles it, and it bounces
 * off the walls of the hero container. Stop scrolling and the ball
 * eventually rests on the bottom of the box.
 *
 * Physics simulation runs in a single rAF loop. Motion values are
 * driven by simulation state, not by `useTransform` on scrollYProgress.
 */
const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const ballX = useMotionValue(0);
  const ballY = useMotionValue(0);
  const ballRotate = useMotionValue(0);

  useEffect(() => {
    /* ----- Matter.js ball-in-a-jar -------------------------------------
       Real 2D physics: a circular Body inside four static walls, gravity
       pulls it to the floor, friction settles it. Scroll input is treated
       as a "jar shake" — the page is moving, so the ball gets an impulse
       in the OPPOSITE direction (inertia). Matter handles the natural
       restitution, rotation, friction, and collision response.
       --------------------------------------------------------------- */

    const node = ref.current;
    if (!node) return;

    // Court bounds (jar perimeter), as fraction of the hero container
    const MIN_X = 0.1;
    const MAX_X = 0.9;
    const MIN_Y = 0.18;
    const MAX_Y = 0.7;

    let w = node.offsetWidth || 1440;
    let h = node.offsetHeight || 900;
    const ballSize = () => (window.innerWidth >= 768 ? 64 : 48);
    const ballRadius = () => ballSize() / 2;

    // Build engine + world
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.0014 },
      // Loosen the solver so collisions feel a touch softer
      positionIterations: 8,
      velocityIterations: 8,
    });

    // Ball — slick rolling friction + light air drag so horizontal momentum
    // carries the ball across the court instead of dying on first floor
    // contact. Spawn ELEVATED on the left side so gravity naturally drops
    // the ball onto the floor and it bounces a few times before settling
    // into a pure roll — reads as a real basketball entering the court
    // when the loading curtain lifts.
    const r0 = ballRadius();
    // Spawn near the top of the court (just below the top wall + clearance)
    // for a bigger drop and more visible bounces on reveal.
    const spawnY = h * MIN_Y + r0 + 6;
    // Ball is created as DYNAMIC but isn't added to the world yet — the
    // release timer below adds it after the loading curtain begins to
    // fade. We avoid `isStatic: true` + setStatic(false) because Matter
    // doesn't always restore the body cleanly after that toggle.
    const ball = Matter.Bodies.circle(w * 0.16, spawnY, r0, {
      restitution: 0.66, // slightly bouncier so the first drop has visible bounces
      friction: 0.025, // very low rolling friction → keeps horizontal momentum
      frictionStatic: 0.02,
      frictionAir: 0.008, // light air drag → settles, but slowly enough to traverse
      density: 0.0025,
      label: 'ball',
    });

    // Walls — thick static bodies just outside the visible court rectangle
    const WALL_THICKNESS = 60;
    const buildWalls = (cw: number, ch: number) => {
      const left = cw * MIN_X;
      const right = cw * MAX_X;
      const top = ch * MIN_Y;
      const bottom = ch * MAX_Y;
      const midX = (left + right) / 2;
      const midY = (top + bottom) / 2;
      const width = right - left;
      const height = bottom - top;
      return [
        Matter.Bodies.rectangle(midX, top - WALL_THICKNESS / 2, width + WALL_THICKNESS * 2, WALL_THICKNESS, { isStatic: true }),
        Matter.Bodies.rectangle(midX, bottom + WALL_THICKNESS / 2, width + WALL_THICKNESS * 2, WALL_THICKNESS, { isStatic: true }),
        Matter.Bodies.rectangle(left - WALL_THICKNESS / 2, midY, WALL_THICKNESS, height + WALL_THICKNESS * 2, { isStatic: true }),
        Matter.Bodies.rectangle(right + WALL_THICKNESS / 2, midY, WALL_THICKNESS, height + WALL_THICKNESS * 2, { isStatic: true }),
      ];
    };

    let walls = buildWalls(w, h);
    // Walls go in immediately; ball is added by the release timer so it
    // doesn't fall behind the loading curtain.
    Matter.Composite.add(engine.world, walls);

    // Wait until the loading curtain begins fading (~1.7s) before
    // dropping the ball into the world. Until then it sits at its spawn
    // position visually (the renderer still reads ball.position) but
    // gravity doesn't act on it because it isn't part of the simulation.
    const initialVx = 9.0;
    const releaseTimer = window.setTimeout(() => {
      Matter.Composite.add(engine.world, ball);
      Matter.Body.setVelocity(ball, { x: initialVx, y: 0 });
      Matter.Body.setAngularVelocity(ball, initialVx / ballRadius());
    }, 1700);

    // Scroll → jar shake. Apply a force opposite to scroll direction. Matter
    // converts force to acceleration internally based on the body's mass.
    const SHAKE_VERT_FORCE = 0.00018; // per (px/s) of scroll velocity
    const SHAKE_HORIZ_FORCE = 0.00018; // matched — gives the ball real horizontal kick
    const MAX_SHAKE_FORCE = 0.07;
    const MAX_SHAKE_HORIZ = 0.07; // allow full horizontal kick magnitude
    const MIN_SCROLL_DELTA = 0.5;

    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastScrollTime, 1) / 1000;
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      lastScrollTime = now;
      if (Math.abs(delta) < MIN_SCROLL_DELTA) return;

      const scrollVel = delta / dt; // px/s
      // OPPOSITE-direction inertia. Cap so violent scrolls don't fling the ball.
      const fy = Math.max(-MAX_SHAKE_FORCE, Math.min(MAX_SHAKE_FORCE, -scrollVel * SHAKE_VERT_FORCE));
      const fx = (Math.random() - 0.5) * Math.min(Math.abs(scrollVel) * SHAKE_HORIZ_FORCE * 2.4, MAX_SHAKE_HORIZ);
      Matter.Body.applyForce(ball, ball.position, { x: fx, y: fy });
    };

    // Resize handling — rebuild walls and resample ball radius
    const onResize = () => {
      const nw = node.offsetWidth || 1440;
      const nh = node.offsetHeight || 900;
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      Matter.Composite.remove(engine.world, walls);
      walls = buildWalls(w, h);
      Matter.Composite.add(engine.world, walls);
    };

    // Render loop — step the engine and sync ball position to motion values
    let rafId = 0;
    let lastFrame = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - lastFrame, 32);
      lastFrame = now;
      Matter.Engine.update(engine, dt);

      const r = ballRadius();
      ballX.set(ball.position.x - r);
      ballY.set(ball.position.y - r);
      // Matter rotation is in radians; convert to degrees
      ballRotate.set((ball.angle * 180) / Math.PI);

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
      window.clearTimeout(releaseTimer);
      Matter.Engine.clear(engine);
    };
  }, [ballX, ballY, ballRotate]);

  return (
    <div
      ref={ref}
      className="relative h-screen bg-paper text-ink paper-grain overflow-hidden"
    >
      {/* Top editorial chrome */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 pt-24 md:pt-28 flex items-center justify-between">
        <span className="label-mono text-inkMuted">BASKETBALL — VOL. I</span>
        <span className="label-mono text-inkMuted hidden md:block">EST. 2026 / IRVINE, CA</span>
      </div>

      {/* Outdoor backyard-court diagram in dusty greens with white lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 800 480"
          className="w-[140%] md:w-[110%] max-w-none h-auto opacity-55"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Subtle vertical gradient on the outer surface for depth */}
            <linearGradient
              id="courtOuter"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0"
                stopColor="#3D5C45"
              />
              <stop
                offset="1"
                stopColor="#2F4A36"
              />
            </linearGradient>
            <linearGradient
              id="courtKey"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0"
                stopColor="#6E8C5C"
              />
              <stop
                offset="1"
                stopColor="#5A7A4E"
              />
            </linearGradient>
          </defs>
          <g transform="translate(400 240) skewX(-22) scale(1, 0.7) translate(-400 -240)">
            {/* Outer court surface — darker forest green */}
            <rect
              x="60"
              y="60"
              width="680"
              height="360"
              fill="url(#courtOuter)"
            />
            {/* Court perimeter line */}
            <rect
              x="60"
              y="60"
              width="680"
              height="360"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
            {/* Mid line */}
            <line
              x1="400"
              y1="60"
              x2="400"
              y2="420"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Center jump circle */}
            <circle
              cx="400"
              cy="240"
              r="48"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle
              cx="400"
              cy="240"
              r="8"
              fill="#FF6A00"
            />
            {/* Left key — lighter sage green fill */}
            <rect
              x="60"
              y="160"
              width="120"
              height="160"
              fill="url(#courtKey)"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle
              cx="180"
              cy="240"
              r="40"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Right key */}
            <rect
              x="620"
              y="160"
              width="120"
              height="160"
              fill="url(#courtKey)"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle
              cx="620"
              cy="240"
              r="40"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Three-point arcs */}
            <path
              d="M 60 110 Q 280 240 60 370"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <path
              d="M 740 110 Q 520 240 740 370"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Hoops */}
            <circle
              cx="80"
              cy="240"
              r="6"
              fill="none"
              stroke="#FF6A00"
              strokeWidth="2.4"
            />
            <circle
              cx="720"
              cy="240"
              r="6"
              fill="none"
              stroke="#FF6A00"
              strokeWidth="2.4"
            />
            {/* Free-throw hash marks */}
            {[180, 200, 220, 260, 280, 300].map((y) => (
              <line
                key={`lh${y}`}
                x1="60"
                y1={y}
                x2="68"
                y2={y}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            ))}
            {[180, 200, 220, 260, 280, 300].map((y) => (
              <line
                key={`rh${y}`}
                x1="732"
                y1={y}
                x2="740"
                y2={y}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Physics-driven basketball — anchored at top-left, x/y in pixels */}
      <motion.img
        src={basketballImg}
        alt=""
        aria-hidden
        className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 object-contain select-none pointer-events-none z-10 will-change-transform"
        style={{
          x: ballX,
          y: ballY,
          rotate: ballRotate,
          filter: 'drop-shadow(0 8px 18px rgba(26,26,26,0.22))',
        }}
      />

      {/* Centerpiece — headline + body, layered above the court */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-[1440px] mx-auto pt-20 md:pt-24 pb-32 md:pb-40">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-medium text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.025em] text-ink"
        >
          Talent doesn't wait
          <br />
          <span className="pl-[8vw] md:pl-[12vw] inline-block">for a camera crew.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-24 max-w-md text-base md:text-lg text-ink/70 leading-relaxed"
        >
          Clutch turns a phone in a courtside corner into a professional-grade analytics rig — built for the leagues that aren't on TV.
        </motion.p>
      </div>

      {/* Bottom-mounted polaroid frames (Obsidian-style anchors) */}
      <FrameMount
        className="hidden md:block absolute bottom-6 left-6 lg:left-12"
        index="01"
        kicker="OVERALL"
        place="Visualize your progression"
        rotate={-3}
        delay={0.7}
      >
        <OvrBadge target={87} />
      </FrameMount>

      <FrameMount
        className="hidden md:block absolute bottom-6 right-6 lg:right-12"
        index="02"
        kicker="LIVE LADDER"
        place="See where you stack up"
        rotate={2.5}
        delay={0.9}
      >
        <RecCenterLeaderboard />
      </FrameMount>

      {/* Mobile: stacked frame mounts row at the bottom */}
      <div className="md:hidden absolute bottom-4 left-0 right-0 px-4 flex items-end justify-between gap-3">
        <FrameMount
          index="01"
          kicker="OVERALL"
          place="Visualize your progression"
          rotate={-3}
          delay={0.7}
          compact
        >
          <OvrBadge target={87} />
        </FrameMount>
        <FrameMount
          index="02"
          kicker="LIVE LADDER"
          place="See where you stack up"
          rotate={2.5}
          delay={0.9}
          compact
        >
          <RecCenterLeaderboard />
        </FrameMount>
      </div>
    </div>
  );
};

interface FrameMountProps {
  className?: string;
  index: string;
  kicker: string;
  place: string;
  rotate: number;
  delay: number;
  compact?: boolean;
  children: React.ReactNode;
}

const FrameMount = ({ className = '', index, kicker, place, rotate, delay, compact, children }: FrameMountProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotate: rotate * 1.6 }}
    animate={{ opacity: 1, y: 0, rotate }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ rotate: 0, y: -4, transition: { duration: 0.3 } }}
    className={`bg-paperAlt border border-ink/10 shadow-[0_18px_40px_-18px_rgba(26,26,26,0.22)] origin-center ${
      compact ? 'p-2.5 w-[44%]' : 'p-3 w-[220px] lg:w-[260px]'
    } ${className}`}
  >
    {/* Inner wrapper provides a positioning context so the index stamp can
        be anchored to the polaroid's top-right corner without colliding
        with the outer div's positioning class. */}
    <div className="relative">
      {/* Index stamp — flush with the polaroid's outer top-right corner */}
      <span className="absolute top-1 right-1.5 font-display font-light italic text-lg md:text-xl text-ink/40 leading-none pointer-events-none z-10">
        {index}
      </span>
      <div className={`bg-paper border border-ink/8 ${compact ? 'aspect-[4/3]' : 'aspect-[5/4]'} relative overflow-hidden`}>{children}</div>
      <div className={`mt-2 flex items-start justify-between gap-3 ${compact ? 'px-1' : 'px-1.5'}`}>
        <span className="label-mono text-ink/70 flex-shrink-0">{kicker}</span>
        <p className="text-[9px] md:text-[10px] text-inkMuted leading-snug text-right hidden lg:block max-w-[60%]">{place}</p>
      </div>
    </div>
  </motion.div>
);

/**
 * OVR rating badge — circular progress ring with a live, fluctuating
 * number. On mount it slowly ramps from 0 to a starting value, then
 * enters a random-walk mode where the value drifts toward fresh targets
 * within [MIN, MAX] using smooth interpolation. Reads as a live rating
 * that wobbles up and down rather than a static number.
 */
const OVR_MIN = 64;
const OVR_MAX = 99;
const OVR_RING_MAX = 99; // ring fills to 100% at OVR 99

const OvrBadge = ({ target = 87 }: { target?: number }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const RAMP_DURATION = 4000; // slow rise from 0 → target
    const TARGET_HOLD_MIN = 1800;
    const TARGET_HOLD_MAX = 3400;
    const LERP_RATE = 0.012; // per-frame fraction of remaining distance

    const start = performance.now();
    let frame: number;
    let phase: 'ramp' | 'drift' = 'ramp';
    let driftTarget = target;
    let nextTargetAt = 0;
    let displayed = 0;

    const tick = (now: number) => {
      if (phase === 'ramp') {
        const t = Math.min((now - start) / RAMP_DURATION, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        displayed = eased * target;
        if (t >= 1) {
          phase = 'drift';
          nextTargetAt = now + TARGET_HOLD_MIN + Math.random() * (TARGET_HOLD_MAX - TARGET_HOLD_MIN);
          driftTarget = OVR_MIN + Math.random() * (OVR_MAX - OVR_MIN);
        }
      } else {
        // Pick a fresh random target periodically
        if (now >= nextTargetAt) {
          driftTarget = OVR_MIN + Math.random() * (OVR_MAX - OVR_MIN);
          nextTargetAt = now + TARGET_HOLD_MIN + Math.random() * (TARGET_HOLD_MAX - TARGET_HOLD_MIN);
        }
        // Smoothly interpolate toward the current target
        displayed += (driftTarget - displayed) * LERP_RATE;
      }
      setValue(displayed);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const radius = 48;
  const cx = 100;
  const cy = 82;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / OVR_RING_MAX, 1);

  return (
    <svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#1A1A1A"
        strokeOpacity="0.10"
        strokeWidth="6"
      />
      {/* Animated progress ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#FF6A00"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* OVR label */}
      <text
        x={cx}
        y={cy - 14}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        fill="#7E7972"
        letterSpacing="1.4"
      >
        OVR
      </text>
      {/* Big number */}
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fontFamily="Inter Tight, Inter, sans-serif"
        fontSize="46"
        fontWeight="500"
        fill="#1A1A1A"
        style={{ letterSpacing: '-0.04em' }}
      >
        {Math.round(value)}
      </text>
    </svg>
  );
};

/**
 * Live ladder for the UCI Anteater Recreation Center. Four players ranked
 * by MMR with PPG. Periodically one player passes another (MMR bump) and
 * Framer Motion's `layout` animation reorders the rows smoothly.
 */
type Player = { id: string; name: string; mmr: number; ppg: number };

const INITIAL_PLAYERS: Player[] = [
  { id: 'p1', name: 'G. Pelayo', mmr: 1287, ppg: 22.4 },
  { id: 'p2', name: 'J. Fok', mmr: 1218, ppg: 19.8 },
  { id: 'p3', name: 'A. Espinosa', mmr: 1176, ppg: 18.3 },
  { id: 'p4', name: 'D. Nguyen', mmr: 1142, ppg: 16.5 },
  { id: 'p5', name: 'T. Yeoh', mmr: 1098, ppg: 14.9 },
  { id: 'p6', name: 'K. Li', mmr: 1057, ppg: 13.2 },
];

const RecCenterLeaderboard = () => {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);

  useEffect(() => {
    const tick = () => {
      setPlayers((prev) => {
        const next = prev.map((p) => ({ ...p }));
        // Pick a random player below first place and bump their MMR enough
        // to (sometimes) leapfrog the player above. Also nudge their PPG.
        const i = 1 + Math.floor(Math.random() * (next.length - 1));
        const bump = 8 + Math.floor(Math.random() * 18);
        next[i].mmr += bump;
        next[i].ppg = Math.max(8, next[i].ppg + (Math.random() - 0.3) * 1.4);
        // The player they passed loses a sliver
        if (i > 0) next[i - 1].mmr -= 3;
        next[i - 1].ppg = Math.max(8, next[i - 1].ppg + (Math.random() - 0.6) * 0.8);
        return next.sort((a, b) => b.mmr - a.mmr);
      });
    };
    const id = setInterval(tick, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full h-full bg-paper p-2 md:p-2.5 flex flex-col">
      <div className="flex items-center mb-1.5">
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink/55 inline-flex items-center gap-1.5">
          UCI ARC · LIVE
          <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
        </span>
      </div>
      <div className="grid grid-cols-[14px_1fr_28px_28px] font-mono text-[7px] uppercase tracking-wider text-ink/40 px-1 mb-1">
        <span>#</span>
        <span>NAME</span>
        <span className="text-right">MMR</span>
        <span className="text-right">PPG</span>
      </div>
      <div className="flex-1 flex flex-col gap-0.5 relative">
        <AnimatePresence>
          {players.map((p, idx) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ layout: { type: 'spring', stiffness: 220, damping: 26 }, opacity: { duration: 0.3 } }}
              className={`grid grid-cols-[14px_1fr_28px_28px] items-center font-mono text-[8.5px] px-1 py-[3px] ${
                idx === 0 ? 'bg-brand/10 text-brand' : 'text-ink'
              }`}
            >
              <span className={idx === 0 ? 'text-brand' : 'text-ink/45'}>{idx + 1}</span>
              <span className="truncate">{p.name}</span>
              <span className="text-right tabular-nums">{p.mmr}</span>
              <span className={`text-right tabular-nums ${idx === 0 ? 'text-brand/80' : 'text-ink/65'}`}>{p.ppg.toFixed(1)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Hero;
