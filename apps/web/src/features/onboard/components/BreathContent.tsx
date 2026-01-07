import { motion } from 'motion/react';

type BreathContentProps = {
  breathText: string;
  breathTimer: number;
};

export function BreathContent({ breathText, breathTimer }: BreathContentProps) {
  return (
    <motion.div
      key="breathing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full h-full gap-6"
    >
      {breathText && (
        <motion.p
          key={breathText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl text-white font-medium text-center px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-sm"
        >
          {breathText}
        </motion.p>
      )}

      {breathTimer > 0 && (
        <motion.div
          key={breathTimer}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl font-bold text-white tracking-widest px-8 py-6 rounded-3xl bg-black/40 backdrop-blur-sm"
        >
          {breathTimer}
        </motion.div>
      )}
    </motion.div>
  );
}
