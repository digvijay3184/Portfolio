"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const DEFAULTS = {
  label: "Hover Me",
  font: {
    fontFamily: "var(--font-sans), sans-serif",
    fontWeight: 500,
    fontSize: 16,
    lineHeight: "1.2em",
    letterSpacing: "0em",
    textAlign: "center" as const,
  },
  fill: "rgba(234, 88, 12, 1)", // Primary #EA580C
  textColor: "#FFFFFF",
  hoverTextColor: "#FFFFFF",
  paddingX: 32,
  paddingY: 12,
  rounded: 9999, // fully rounded
  scrambleOptions: {
    speed: 60,
    cycles: 4,
    chars: "!@#$%^&*():{};|,.<>/?",
  },
  sweep: true,
  sweepOptions: {
    color: "#F97316", // Hover primary
    speed: 7,
    count: 2,
    width: 8,
  },
  border: true,
  borderOptions: { color: "rgba(249, 115, 22, 0.5)", width: 1 },
  transition: {
    type: "tween",
    stiffness: 800,
    damping: 60,
    mass: 1,
    duration: 0.3,
    ease: "easeInOut",
  },
};

const MIN_STEP_MS = 16;

const SWEEP_SECONDS_SLOW = 2;
const SWEEP_SECONDS_FAST = 0.15;
const TRAIL_SHORT = 6;
const TRAIL_LONG = 50;
const FACE_AT = 50;
const FACE_EDGE = 1.5;
const BAND_SCALE = 1.25;
const FLIP_SHARE = 0.001;

/** A 1–10 slider onto the values its ends stand for. */
const mapSlider = (value: number, atOne: number, atTen: number) => {
  const t = (Math.min(10, Math.max(1, value)) - 1) / 9;
  return atOne + (atTen - atOne) * t;
};

export interface ScrambleOptions {
  speed: number;
  cycles: number;
  chars: string;
}

export interface SweepOptions {
  color: string;
  speed: number;
  count: number;
  width: number;
}

export interface BorderOptions {
  color: string;
  width: number;
}

export interface EncryptButtonProps {
  label?: string;
  font?: CSSProperties;
  fill?: string;
  textColor?: string;
  hoverTextColor?: string;
  paddingX?: number;
  paddingY?: number;
  rounded?: number | string;
  scrambleOptions?: ScrambleOptions;
  sweep?: boolean;
  sweepOptions?: SweepOptions;
  border?: boolean;
  borderOptions?: BorderOptions;
  transition?: any;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function EncryptButton(props: EncryptButtonProps) {
  const {
    label = DEFAULTS.label,
    font = DEFAULTS.font,
    fill = DEFAULTS.fill,
    textColor = DEFAULTS.textColor,
    hoverTextColor = DEFAULTS.hoverTextColor,
    paddingX = DEFAULTS.paddingX,
    paddingY = DEFAULTS.paddingY,
    rounded = DEFAULTS.rounded,
    scrambleOptions = DEFAULTS.scrambleOptions,
    sweep = DEFAULTS.sweep,
    sweepOptions = DEFAULTS.sweepOptions,
    border = DEFAULTS.border,
    borderOptions = DEFAULTS.borderOptions,
    transition = DEFAULTS.transition,
    style,
    className,
    onClick,
    href
  } = props;

  const [text, setText] = useState(label);
  const [hover, setHover] = useState(false);
  const rafRef = useRef<number | null>(null);

  const configRef = useRef<any>(null);
  configRef.current = { label, scrambleOptions };

  const borderColor = borderOptions?.color ?? DEFAULTS.borderOptions.color;
  const borderWidth = border ? (borderOptions?.width ?? 0) : 0;
  const sweepColor = sweepOptions?.color ?? DEFAULTS.sweepOptions.color;
  const sweepSeconds = mapSlider(
    sweepOptions?.speed ?? DEFAULTS.sweepOptions.speed,
    SWEEP_SECONDS_SLOW,
    SWEEP_SECONDS_FAST
  );
  const sweepCount = Math.max(
    1,
    Math.round(sweepOptions?.count ?? DEFAULTS.sweepOptions.count)
  );
  const trail = mapSlider(
    sweepOptions?.width ?? DEFAULTS.sweepOptions.width,
    TRAIL_SHORT,
    TRAIL_LONG
  );

  const yKeyframes: string[] = ["-100%"];
  const yTimes: number[] = [0];
  const flipKeyframes: number[] = [];
  const flipTimes: number[] = [];
  for (let i = 0; i < sweepCount; i++) {
    const downward = i % 2 === 0;
    const start = i / sweepCount;
    const end = (i + 1) / sweepCount;
    yKeyframes.push(downward ? "100%" : "-100%");
    yTimes.push(end);
    const facing = downward ? BAND_SCALE : -BAND_SCALE;
    flipKeyframes.push(facing, facing);
    flipTimes.push(
      start,
      i === sweepCount - 1 ? end : end - FLIP_SHARE / sweepCount
    );
  }

  const stopScramble = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setText(configRef.current.label);
  };

  const startScramble = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    const { label: target, scrambleOptions: opts } = configRef.current;
    const chars = opts?.chars?.length
      ? opts.chars
      : DEFAULTS.scrambleOptions.chars;
    const cycles = Math.max(
      1,
      opts?.cycles ?? DEFAULTS.scrambleOptions.cycles
    );
    const speed = Math.max(1, opts?.speed ?? DEFAULTS.scrambleOptions.speed);
    const stepMs = Math.max(MIN_STEP_MS, 1000 / speed);
    const letters = [...target];
    const total = letters.length * cycles;

    let step = 0;
    let last = 0;
    const tick = (now: number) => {
      if (!last) last = now;
      if (now - last >= stepMs) {
        last = now;
        const scrambled = letters
          .map((char, index) => {
            if (step / cycles > index) return char;
            if (!char.trim()) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        setText(scrambled);
        step++;
        if (step >= total) {
          rafRef.current = null;
          setText(target);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (rafRef.current == null) setText(label);
  }, [label]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const MotionComponent = href ? motion.a : motion.div;
  const asAnchorProps = href ? { href } : {};

  return (
    <MotionComponent
      aria-label={label}
      initial={false}
      onHoverStart={() => {
        setHover(true);
        startScramble();
      }}
      onHoverEnd={() => {
        setHover(false);
        stopScramble();
      }}
      onClick={onClick}
      className={className}
      {...asAnchorProps}
      style={{
        ...style,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        width: "fit-content",
        padding: `${paddingY}px ${paddingX}px`,
        borderRadius: rounded,
        background: fill,
        border:
          borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
        cursor: "pointer",
        overflow: "hidden",
        textDecoration: "none",
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      {sweep && hover ? (
        <motion.span
          aria-hidden
          initial={{ y: "-100%", scaleY: BAND_SCALE }}
          animate={{ y: yKeyframes, scaleY: flipKeyframes }}
          transition={{
            y: {
              duration: sweepSeconds * sweepCount,
              ease: "linear",
              times: yTimes,
            },
            scaleY: {
              duration: sweepSeconds * sweepCount,
              ease: "linear",
              times: flipTimes,
            },
          }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            scaleX: BAND_SCALE,
            background: `linear-gradient(to bottom, transparent ${FACE_AT - trail}%, ${sweepColor} ${FACE_AT}%, transparent ${FACE_AT + FACE_EDGE}%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}

      <motion.span
        initial={false}
        animate={{ color: hover ? hoverTextColor : textColor }}
        transition={transition}
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          ...font,
        }}
      >
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ visibility: "hidden" }}>{label}</span>
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {text}
          </span>
        </span>
      </motion.span>
    </MotionComponent>
  );
}

EncryptButton.displayName = "Encrypt Button";
