import { motion } from "framer-motion";

interface ScrollIndicatorProps {
  label?: string;
}

export default function ScrollIndicator({ label }: ScrollIndicatorProps) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      {label && (
        <span className="text-sm text-slate-400 tracking-widest uppercase">
          {label}
        </span>
      )}
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="text-slate-400"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </motion.svg>
    </motion.div>
  );
}
