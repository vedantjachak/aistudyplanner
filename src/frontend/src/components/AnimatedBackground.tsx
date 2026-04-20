import { motion } from "motion/react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base background */}
      <div className="absolute inset-0 bg-background" />

      {/* Primary violet orb */}
      <motion.div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle, oklch(var(--primary)) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Cyan orb bottom-right */}
      <motion.div
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full opacity-[0.05]"
        style={{
          background:
            "radial-gradient(circle, oklch(var(--secondary)) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Small accent orb center */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(circle, oklch(var(--accent)) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.04, 0.07, 0.04],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, oklch(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
