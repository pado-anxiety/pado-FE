import { motion } from 'motion/react';

import { Text } from '@pado/ui';

import { NextButton } from './NextButton';
import { RestartButton } from './RestartButton';
import { StartButton } from './StartButton';

type BreathContentProps = {
  isStarted: boolean;
  isCompleted: boolean;
  breathText: string;
  timer: number;
  sessionCount: number;
  onStartClick: () => void;
  onRestart: () => void;
  getDuration: () => number;
};

export function BreathContent({
  isStarted,
  isCompleted,
  breathText,
  timer,
  sessionCount,
  onStartClick,
  onRestart,
  getDuration,
}: BreathContentProps) {
  return (
    <div className="z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] flex flex-col items-center justify-center w-full px-4">
      {!isStarted ? (
        <StartButton onClick={onStartClick} />
      ) : (
        <div className="flex flex-col items-center text-center gap-6">
          <div className="bg-white/30 backdrop-blur-md rounded-2xl px-6 py-4">
            <Text className="text-title-medium text-gray-900 whitespace-pre-wrap leading-tight">
              {breathText}
            </Text>
          </div>
          {timer > 0 && (
            <motion.div
              key={timer}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/30 backdrop-blur-md rounded-2xl px-6 py-4"
            >
              <Text className="text-title-large text-blue-900">{timer}</Text>
            </motion.div>
          )}
          {isCompleted && (
            <div className="flex flex-col items-center gap-4 mt-4">
              <RestartButton onClick={onRestart} />
              <NextButton
                sessionCount={sessionCount}
                getDuration={getDuration}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
